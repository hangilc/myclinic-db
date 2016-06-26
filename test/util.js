var setup = require("./setup");
var moment = require("moment");
var conti = require("./conti");
var db = require("../index");

function incDate(sqldate, n){
	if( n === undefined ) n = 1;
	return moment(sqldate).add(1, "days").format("YYYY-MM-DD");
}

function incMonth(sqldate, n){
	if( n === undefined ) n = 1;
	return moment(sqldate).add(1, "months").format("YYYY-MM-DD");
}

function incYear(sqldate, n){
	if( n === undefined ) n = 1;
	return moment(sqldate).add(1, "years").format("YYYY-MM-DD");
}

function pad(num, digits){
	num = "" + num;
	if( num.length < digits ){
		return pad("0" + num, digits - 1);
	} else {
		return num;
	}
}

function rotate(current, values){
	var i;
	i = values.indexOf(current);
	if( i < 0 ){
		return values[0];
	}
	i += 1;
	if( i >= values.length ){
		i = 0;
	}
	return values[i];
}

exports.range = function(begin, end){
	var arr = [];
	for(var i=begin;i<end;i++){
		arr.push(i);
	}
	return arr;
};

exports.assign = function(dst, src){
	Object.keys(src).forEach(function(key){
		dst[key] = src[key];
	})
	return dst;
};

exports.clearTable = function(conn, tableName, cb){
	conn.query("delete from " + tableName, cb);
};

exports.resetTable = function(conn, tableName, cb){
	exports.clearTable(conn, tableName, function(err){
		if( err ){
			cb(err);
			return;
		}
		conn.query("alter table " + tableName + " auto_increment = 1", cb);
	})
};

exports.clearTables = function(conn, tableNames, cb){
	iter(0);

	function iter(i){
		if( i >= tableNames.length ){
			cb();
			return;
		}
		exports.clearTable(conn, tableNames[i], function(err){
			if( err ){
				cb(err);
				return;
			}
			iter(i+1);
		})
	}
};

exports.resetTables = function(conn, tableNames, cb){
	iter(0);

	function iter(i){
		if( i >= tableNames.length ){
			cb();
			return;
		}
		exports.resetTable(conn, tableNames[i], function(err){
			if( err ){
				cb(err);
				return;
			}
			iter(i+1);
		})
	}
};

exports.initTables = function(conn, clearTables, resetTables, cb){
	exports.clearTables(conn, clearTables, function(err){
		if( err ){
			cb(err);
			return;
		}
		exports.resetTables(conn, resetTables, cb);
	})
};

exports.withConnect = function(fn, done){
	setup.connect(function(err, conn){
		if( err ){
			done(err);
			return;
		}
		fn(conn, function(err){
			if( err ){
				setup.release(conn, function(err_){
					console.log("setup.release failed", err_);
					done(err);
				})
				return;
			}
			setup.release(conn, done);
		})
	})
}

exports.createClearTableFun = function(tableName){
	return function(done){
		setup.connect(function(err, conn){
			if( err ){
				done(err);
				return;
			}
			conn.query("delete from " + tableName, function(err){
				if( err ){
					setup.release(conn, function(){
						done(err);
					});
					return;
				}
				conn.query("alter table " + tableName + " auto_increment = 1", function(err){
					if( err ){
						setup.release(conn, function(){
							done(err);
						});
						return;
					}
					setup.release(conn, done);
				})
			})
		})
	};
};

function assignProps(data, props){
	for(var key in props){
		if( props.hasOwnProperty(key) ){
			if( !(key in data) ){
				throw new Error("invalid property: " + key);
			}
			data[key] = props[key];
		}
	}
	return data;
}

exports.mockPatient = function(props){
	props = props || {};
	var data = {
		last_name: "診療",
		first_name: "太郎",
		last_name_yomi: "しんりょう",
		first_name_yomi: "たろう",
		birth_day: "1957-06-02",
		sex: "M",
		phone: "03-1234-5678",
		address: "no where"
	};
	assignProps(data, props);
	return data;
};

exports.mockVisit = function(props){
	props = props || {};
	var data = {
		patient_id: 199,
		v_datetime: "2016-06-22 11:51:03",
		shahokokuho_id: 1234,
		koukikourei_id: 0,
		roujin_id: 0,
		kouhi_1_id: 0,
		kouhi_2_id: 0,
		kouhi_3_id: 0
	};
	assignProps(data, props);
	return data;
};

exports.deleteUnusedVisitColumn = function(data){
	delete data.jihi;
};


var mockTextIndex = 1;

exports.mockText = function(props){
	props = props || {};
	var data = {
		visit_id: 1,
		content: "テスト" + mockTextIndex++
	};
	assignProps(data, props);
	return data;
};

exports.deleteUnusedTextColumn = function(text){
	delete text.pos;
};

exports.alterText = function(text){
	text.content += ":altered" + mockTextIndex++; 
}

var mockShahokokuhoIndex = 1;

exports.mockShahokokuho = function(){
	return {
		patient_id: 6058,
		hokensha_bangou: 138156,
		hihokensha_kigou: "15-3A",
		hihokensha_bangou: "89",
		honnin: 0,
		valid_from: "2016-02-13",
		valid_upto: "2017-09-30",
		kourei: 0
	};
};

exports.deleteUnusedShahokokuhoColumn = function(shahokokuho){
	delete shahokokuho.active;
}

exports.alterShahokokuho = function(hoken){
	hoken.hokensha_bangou = hoken.hokensha_bangou === 138156 ? 6137590 : 138156;
	hoken.hihokensha_kigou += ":changed";
	hoken.hihokensha_bangou += ":changed";
	hoken.honnin = hoken.honnin === 0 ? 1 : 0;
	hoken.valid_from = incDate(hoken.valid_from);
	hoken.valid_upto = incDate(hoken.valid_upto);
}

var mockKoukikoureiIndex = 1;

exports.mockKoukikourei = function(){
	return {
		patient_id: 3241,
		hokensha_bangou: "39131156",
		hihokensha_bangou: "04324066",
		futan_wari: 1,
		valid_from: "2015-08-01",
		valid_upto: "2016-07-31"
	};
};

exports.deleteUnusedKoukikoureiColumn = function(koukikourei){
	// nop
}

exports.alterKoukikourei = function(hoken){
	hoken.hokensha_bangou = hoken.hokensha_bangou === "39131156" ? "39131123" : "39131156";
	hoken.hihokensha_bangou = pad((((+hoken.hihokensha_bangou) + 1) % 100000000) + "", 8);
	hoken.futan_wari = (hoken.futan_wari + 1) % 4;
	hoken.valid_from = incYear(hoken.valid_from);
	hoken.valid_upto = incYear(hoken.valid_upto);
}

var mockRoujinIndex = 1;

exports.mockRoujin = function(){
	return {
		patient_id: 5843,
		shichouson: 27138155,
		jukyuusha: 8767006,
		futan_wari: 1,
		valid_from: "2006-08-01",
		valid_upto: "2008-03-31"
	};
};

exports.deleteUnusedRoujinColumn = function(roujin){
	delete roujin.active;
}

exports.alterRoujin = function(hoken){
	hoken.shichouson = (hoken.shichouson + 1) % 100000000;
	hoken.jukyuusha = (hoken.jukyuusha + 1) % 10000000;
	hoken.futan_wari = (hoken.futan_wari + 1) % 4;
	hoken.valid_from = incYear(hoken.valid_from);
	hoken.valid_upto = incYear(hoken.valid_upto);
}

var mockKouhiIndex = 1;

exports.mockKouhi = function(){
	return {
		patient_id: 3294,
		futansha: 80137151,
		jukyuusha: 9518832,
		valid_from: "2015-10-01",
		valid_upto: "2016-09-30"
	};
};

exports.deleteUnusedKouhiColumn = function(kouhi){
	delete kouhi.active;
	delete kouhi.category;
}

exports.alterKouhi = function(hoken){
	hoken.futansha = (hoken.futansha + 1) % 100000000;
	hoken.jukyuusha = (hoken.jukyuusha + 1) % 10000000;
	hoken.valid_from = incYear(hoken.valid_from);
	hoken.valid_upto = incYear(hoken.valid_upto);
}

var mockDrugIndex = 1;

exports.mockDrug = function(props){
	return assignProps({
		visit_id: 1000,
		d_iyakuhincode: 611180001,
		d_amount: "3",
		d_usage: "分３　毎食後",
		d_days: 5,
		d_category: 0,
		d_prescribed: 0
	}, props || {});
};

exports.deleteUnusedDrugColumn = function(data){
	delete data.d_pos;
	delete data.d_shuukeisaki;
}

exports.alterDrug = function(data){
	data.d_iyakuhincode = rotate(data.d_iyakuhincode, [611180001, 616130295, 662230003]);
	data.d_amount = (+data.d_amount + 1) + "";
	data.d_usage = rotate(data.d_usage, ["分３　毎食後", "分２　朝夕食後", "分１　朝食後"]);
	data.d_days = data.d_days + 1;
	data.d_category = rotate(data.d_category, [0, 1, 2, 3]);
	data.d_prescribed = rotate(data.d_prescribed, [0, 1]);
}

var mockShinryouIndex = 1;

exports.mockShinryou = function(){
	return {
		visit_id: 1000 + mockShinryouIndex++,
		shinryoucode: 111003610
	};
};

exports.deleteUnusedShinryouColumn = function(data){
	// nop
}

exports.alterShinryou = function(data){
	data.shinryoucode = rotate(data.shinryoucode, [111003610, 120000710, 120001810]);
}

var mockConductIndex = 1;

exports.mockConduct = function(){
	return {
		visit_id: 3000 + mockConductIndex++,
		kind: 0
	};
};

exports.deleteUnusedConductColumn = function(data){
	delete data.active;
	delete data.category;
}

exports.alterConduct = function(data){
	data.kind = rotate(data.kind, [0, 1, 2, 3]);
}

var mockGazouLabelIndex = 1;

exports.mockGazouLabel = function(){
	return {
		visit_conduct_id: 200 + mockGazouLabelIndex++,
		label: "胸部単純Ｘ線"
	};
};

exports.deleteUnusedGazouLabelColumn = function(data){
	
}

exports.alterGazouLabel = function(data){
	data.label = rotate(data.label, ["胸部単純Ｘ線", "腹部単純Ｘ線"])
}

var mockConductShinryouIndex = 1;

exports.mockConductShinryou = function(){
	return {
		visit_conduct_id: 300 + mockConductShinryouIndex++,
		shinryoucode: 170001910
	};
};

exports.deleteUnusedConductShinryouColumn = function(data){

}

exports.alterConductShinryou = function(data){
	data.shinryoucode = rotate(data.shinryoucode, [170001910, 170000410])
}

var mockConductDrugIndex = 1;

exports.mockConductDrug = function(){
	return {
		visit_conduct_id: 400 + mockConductDrugIndex++,
		iyakuhincode: 640453081,
		amount: 1.0
	};
};

exports.deleteUnusedConductDrugColumn = function(data){

}

exports.alterConductDrug = function(data){
	data.iyakuhincode = rotate(data.iyakuhincode, [640453081, 643310065]);
	data.amount += 1.0;
}

var mockConductKizaiIndex = 1;

exports.mockConductKizai = function(){
	return {
		visit_conduct_id: 500 + mockConductKizaiIndex++,
		kizaicode: 700030000,
		amount: 1.0
	};
};

exports.deleteUnusedConductKizaiColumn = function(data){

}

exports.alterConductKizai = function(data){
	data.kizaicode = rotate(data.kizaicode, [700030000, 700080000]);
	data.amount += 1.0;
}

var mockIyakuhinMasterIndex = 1;

exports.mockIyakuhinMaster = function(props){
	props = props || {};
	var data = {
		iyakuhincode: 620000033 + mockIyakuhinMasterIndex++,
		name: "カロナール錠３００　３００ｍｇ",
		yomi: "ｶﾛﾅｰﾙｼﾞｮｳ300",
		unit: "錠",
		yakka: "8.50",
		madoku: "0",
		kouhatsu: "1",
		zaikei: "1",
		valid_from: "2016-04-01",
		valid_upto: "0000-00-00"
	};
	assignProps(data, props);
	return data;
};

exports.deleteUnusedIyakuhinMasterColumn = function(data){
	delete data.yakkacode;
}

var mockShinryouMasterIndex = 1;

exports.mockShinryouMaster = function(){
	return {
		shinryoucode: 111000110 + mockShinryouMasterIndex++,
		name: "初診",
		tensuu: "282.00",
		tensuu_shikibetsu: "3",
		shuukeisaki: "110",
		houkatsukensa: "00",
		oushinkubun: "0",
		kensagroup: "00",
		roujintekiyou: "0",
		code_shou: "1",
		code_bu: "01",
		code_alpha: "A",
		code_kubun: "000",
		valid_from: "2016-04-01",
		valid_upto: "0000-00-00"
	};
};

exports.deleteUnusedShinryouMasterColumn = function(data){
	
}

var mockKizaiMasterIndex = 1;

exports.mockKizaiMaster = function(){
	return {
 		kizaicode: 700030000 + mockKizaiMasterIndex++,
		name: "大角",
		yomi: "ﾀﾞｲｶｸ",
		unit: "枚",
		kingaku: "116.00",
		valid_from: "2016-04-01",
		valid_upto: "0000-00-00"
	};
};

exports.deleteUnusedKizaiMasterColumn = function(data){
	
}

var mockChargeIndex = 1;

exports.mockCharge = function(){
	return {
		visit_id: 1000 + mockChargeIndex++,
		charge: 1280
	};
};

exports.deleteUnusedChargeColumn = function(data){
	delete data.jindouteki_mishuu;
	delete data.inchou_kessai;
}

exports.alterCharge = function(data){
	data.charge += 10;
}

var mockWqueueIndex = 1;

exports.mockWqueue = function(props){
	props = props || {};
	var data = {
		visit_id: 4321 + mockWqueueIndex++,
		wait_state: 0
	};
	assignProps(data, props);
	return data;
};

exports.deleteUnusedWqueueColumn = function(data){

}

exports.alterWqueue = function(data){
	data.wait_state = rotate(data.wait_state, [0, 1, 2, 3]);
}

exports.batchInsertPatients = function(conn, patients, done){
	conti.exec([
		conti.forEach(patients, function(patient, done){
			db.insertPatient(conn, patient, done);
		})
	], done);
};

exports.batchInsertVisits = function(conn, visits, done){
	conti.exec([
		conti.forEach(visits, function(visit, done){
			db.insertVisit(conn, visit, done);
		})
	], done);
};

exports.batchInsertTexts = function(conn, texts, done){
	conti.exec([
		conti.forEach(texts, function(text, done){
			db.insertText(conn, text, done);
		})
	], done);
}
