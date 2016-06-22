var setup = require("./setup");
var moment = require("moment");

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

var mockTextIndex = 1;

exports.mockText = function(){
	return {
		visit_id: 1,
		content: "テスト" + mockTextIndex++
	};
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