var setup = require("./setup");
var moment = require("moment");

function incDate(sqldate, n){
	if( n === undefined ) n = 1;
	return moment(sqldate).add(1, "days").format("YYYY-MM-DD");
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