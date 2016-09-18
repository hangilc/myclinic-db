"use strict";

var conti = require("conti");
var db = require("../index");
var moment = require("./moment-ex");

var mockIndex = 0;

function addDefaults(dst, src){
	Object.keys(src).forEach(function(key){
		if( !(key in dst) ){
			dst[key] = src[key];
		}
	})
	return dst;
}

exports.assign = function(dst){
	var srcList = Array.prototype.slice.call(arguments, 1);
	srcList.forEach(function(src){
		Object.keys(src).forEach(function(key){
			dst[key] = src[key];
		})
	});
	return dst;
}

exports.objArray = function(n, setup){
	var arr = [];
	for(var i=0;i<n;i++){
		var obj = {};
		if( setup ){
			if( typeof setup === "function" ){
				var modified = setup(obj, i);
				if( modified !== undefined ){
					obj = modified;
				}
			} else {
				Object.keys(setup).forEach(function(key){
					obj[key] = setup[key];
				})
			}
		}
		arr.push(obj);
	}
	return arr;
};

function ValidInterval(valid_from, valid_upto){
	valid_from = valid_from || moment("2014-04-01");
	valid_upto = valid_upto || "0000-00-00";
	this.valid_from = valid_from;
	this.valid_upto = valid_upto;
}

exports.ValidInterval = ValidInterval;

exports.mockPatient = function(){
	mockIndex += 1;
	return {
		last_name: "LAST_NAME_" + mockIndex,
		first_name: "FIRST_NAME_" + mockIndex,
		last_name_yomi: "LAST_NAME_YOMI_" + mockIndex,
		first_name_yomi: "FIRST_NAME_YOMI_" + mockIndex,
		birth_day: mockBirthDay(),
		sex: (mockIndex % 2 == 0) ? "M" : "F",
		phone: "03-1234-5678",
		address: "ADDRESS_" + mockIndex
	};

	function mockBirthDay(){
		switch(mockIndex % 3){
			case 0: return "1923-04-12";
			case 1: return "1957-10-03";
			default: return "1991-06-21";
		}
	}
};

var mockVisitBaseDateTime = moment("2016-06-22 09:00:00");

exports.mockVisit = function(){
	mockIndex += 1;
	return {
		patient_id: 0,
		v_datetime: mockVisitBaseDateTime.add(10, "minutes").format("YYYY-MM-DD HH:mm:ss"),
		shahokokuho_id: 0,
		koukikourei_id: 0,
		roujin_id: 0,
		kouhi_1_id: 0,
		kouhi_2_id: 0,
		kouhi_3_id: 0
	};
};

exports.mockIyakuhinMaster = function(){
	mockIndex += 1;
	return {
		iyakuhincode: mockIndex,
		name: "IYAKUHIN_NAME_" + mockIndex,
		yomi: "IYAKUHIN_YOMI_" + mockIndex,
		unit: mockIndex % 2 ? "錠" : "ｇ",
		yakka: "8.50",
		madoku: "0",
		kouhatsu: "1",
		zaikei: "1",
		valid_from: "2014-04-01",
		valid_upto: "0000-00-00"
	};
};

exports.mockDrug = function(){
	mockIndex += 1;
	return {
		visit_id: 0,
		d_iyakuhincode: 0,
		d_amount: "3",
		d_usage: "分３　毎食後",
		d_days: 5,
		d_category: 0,
		d_prescribed: 0
	};
};

exports.insertIyakuhinMaster = function(conn, master, done){
	var masters = Array.isArray(master) ? master : [master];
	conti.forEach(masters, function(master, done){
		addDefaults(master, exports.mockIyakuhinMaster());
		if( moment.isMoment(master.valid_from) ){
			master.valid_from = master.valid_from.toSqlDate();
		}
		if( moment.isMoment(master.valid_upto) ){
			master.valid_upto = master.valid_upto.toSqlDate();
		}
		db.insertIyakuhinMaster(conn, master, done);
	}, done);
};

exports.taskInsertIyakuhinMaster = function(conn, master){
	return function(done){
		exports.insertIyakuhinMaster(conn, master, done);
	}
};

exports.insertPatient = function(conn, patient, done){
	var patients = Array.isArray(patient) ? patient : [patient];
	conti.forEach(patients, function(patient, done){
		addDefaults(patient, exports.mockPatient());
		db.insertPatient(conn, patient, done);
	}, done);
};

exports.taskInsertPatient = function(conn, patient){
	return function(done){
		exports.insertPatient(conn, patient, done);
	}
};

exports.insertDrug = function(conn, drug, done){
	var drugs = Array.isArray(drug) ? drug : [drug];
	conti.forEach(drugs, function(drug, done){
		addDefaults(drug, exports.mockDrug());
		db.insertDrug(conn, drug, done);
	}, done);
}

exports.insertVisit = function(conn, visit, done){
	var visits = Array.isArray(visit) ? visit : [visit];
	conti.forEach(visits, function(visit, done){
		addDefaults(visit, exports.mockVisit());
		if( moment.isMoment(visit.v_datetime) ){
			visit.v_datetime = visit.v_datetime.toSqlDateTime();
		}
		conti.exec([
			function(done){
				db.insertVisit(conn, visit, done);
			},
			function(done){
				if( visit.drugs ){
					visit.drugs.forEach(function(drug){
						drug.visit_id = visit.visit_id;
					});
					exports.insertDrug(conn, visit.drugs, done);
				} else {
					setImmediate(done);
				}
			}
		], done);
	}, done);
};

function arrayFind(arr, fn){
	var item;
	for(var i=0;i<arr.length;i++){
		var e = arr[i];
		if( fn(e) ){
			item = e;
			break;
		}
	}
	return item;
}

exports.toFullVisit = function(visit, env){
	visit = exports.assign({}, visit);
	addDefaults(visit, {
		charge: null,
		texts: [],
		drugs: [],
		shinryou_list: [],
		conducts: [],
		kouhi_list: [],
		shahokokuho: null,
		koukikourei: null,
		roujin: null
	});
	visit.drugs = visit.drugs.slice();
	visit.drugs.forEach(function(drug){
		var iyakuhincode = drug.d_iyakuhincode;
		var master = arrayFind(env.iyakuhinMasters, function(m){ return m.iyakuhincode === iyakuhincode; });
		exports.assign(drug, master); 
	})
	return visit;
}

