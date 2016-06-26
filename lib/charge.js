"use strict";

var util = require("./util");

exports.insertCharge = function(conn, charge, cb){
    var sql = "insert into visit_charge set visit_id = ?, charge = ?";
    var args = [charge.visit_id, charge.charge];
    conn.query(sql, args, cb);
};

exports.getCharge = function(conn, visitId, cb){
	var sql = "select * from visit_charge where visit_id = ?";
	conn.query(sql, [visitId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var charge = result[0];
			util.deleteUnusedChargeColumn(charge);
			cb(undefined, charge);
			return;
		}
		cb("getCharge failed");
	})
};

exports.findCharge = function(conn, visitId, cb){
	var sql = "select * from visit_charge where visit_id = ?";
	conn.query(sql, [visitId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var charge = result[0];
			util.deleteUnusedChargeColumn(charge);
			cb(undefined, charge);
			return;
		}
		if( result.length === 0 ){
			cb(undefined, null);
			return;
		}
		cb("findCharge failed");
	})
};

exports.updateCharge = function(conn, charge, cb){
    var sql = "update visit_charge set charge = ? where visit_id = ?";
    var args = [charge.charge, charge.visit_id];
	conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateCharge failed");
    });
};

exports.deleteCharge = function(conn, visitId, cb){
	var sql = "delete from visit_charge where visit_id = ?";
	conn.query(sql, [visitId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteCharge failed");
	})
};