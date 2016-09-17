"use strict";

var conti = require("conti");
var db = require("../index");
var moment = require("moment");

var mockIndex = 0;

function addDefaults(dst, src){
	Object.keys(src).forEach(function(key){
		if( !(key in dst) ){
			dst[key] = src[key];
		}
	})
	return dst;
}

exports.objArray = function(n, setup){
	var arr = [];
	for(var i=0;i<n;i++){
		var obj = {};
		if( setup ){
			var modified = setup(obj, i);
			if( modified !== undefined ){
				obj = modified;
			}
		}
		arr.push(obj);
	}
	return arr;
}

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
		patient_id: mockIndex,
		v_datetime: mockVisitBaseDateTime.add(10, "minutes").format("YYYY-MM-DD HH:mm:ss"),
		shahokokuho_id: (mockIndex % 3 == 0) ? mockIndex : 0,
		koukikourei_id: (mockIndex % 3 == 1) ? mockIndex : 0,
		roujin_id: (mockIndex % 3 == 2) ? mockIndex : 0,
		kouhi_1_id: (mockIndex % 4 >= 3) ? mockIndex : 0,
		kouhi_2_id: (mockIndex % 4 >= 2) ? mockIndex+1 : 0,
		kouhi_3_id: (mockIndex % 4 >= 1) ? mockIndex+2 : 0
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
		valid_from: "2016-04-01",
		valid_upto: "0000-00-00"
	};
};

exports.insertPatient = function(conn, patient, done){
	var patients = Array.isArray(patient) ? patient : [patient];
	conti.forEach(patients, function(patient, done){
		addDefaults(patient, exports.mockPatient());
		db.insertPatient(conn, patient, done);
	}, done);
}

exports.insertVisit = function(conn, visit, done){
	var visits = Array.isArray(visit) ? visit : [visit];
	conti.forEach(visits, function(visit, done){
		addDefaults(visit, exports.mockVisit());
		db.insertVisit(conn, visit, done);
	}, done);
}
