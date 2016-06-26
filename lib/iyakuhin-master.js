"use strict";

var util = require("./util");

exports.insertIyakuhinMaster = function(conn, master, cb){
	var sql = "insert into iyakuhin_master_arch set iyakuhincode = ?, " +
		" name = ?, yomi = ?, unit = ?, yakka = ?, madoku = ?, kouhatsu = ?, " +
		" zaikei = ?, valid_from = ?, valid_upto = ?";
    var args = [
    	master.iyakuhincode, master.name, master.yomi, master.unit, master.yakka,
    	master.madoku, master.kouhatsu, master.zaikei, master.valid_from, 
    	master.valid_upto
    ];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	cb();
    });
};

exports.getIyakuhinMaster = function(conn, iyakuhincode, at, cb){
	var sql = "select * from iyakuhin_master_arch " +
		" where iyakuhincode = ? and valid_from <= date(?) " +
		" and (valid_upto = '0000-00-00' or valid_upto >= date(?))";
	var args = [iyakuhincode, at, at];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var master = result[0];
			util.deleteUnusedIyakuhinMasterColumn(master);
			cb(undefined, master);
			return;
		}
		cb("getIyakuhinMaster failed");
	})
};

exports.findIyakuhinMaster = function(conn, iyakuhincode, at, cb){
	var sql = "select * from iyakuhin_master_arch " +
		" where iyakuhincode = ? and valid_from <= date(?) " +
		" and (valid_upto = '0000-00-00' or valid_upto >= date(?))";
	var args = [iyakuhincode, at, at];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var master = result[0];
			util.deleteUnusedIyakuhinMasterColumn(master);
			cb(undefined, master);
			return;
		}
		if( result.length === 0 ){
			cb(undefined, null);
			return;
		}
		cb("getIyakuhinMaster failed");
	})
};
