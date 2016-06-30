"use strict";

var util = require("./util");

exports.insertShahokokuho = function(conn, shahokokuho, cb){
	var sql = "insert into hoken_shahokokuho set patient_id = ?, hokensha_bangou = ?, " +
        " hihokensha_kigou = ?, hihokensha_bangou = ?, honnin = ?, kourei = ?, " +
        " valid_from = ?, valid_upto = ?";
    var args = [
        shahokokuho.patient_id, shahokokuho.hokensha_bangou,
        shahokokuho.hihokensha_kigou, shahokokuho.hihokensha_bangou, 
        shahokokuho.honnin, shahokokuho.kourei,
        shahokokuho.valid_from, shahokokuho.valid_upto
    ];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var shahokokuhoId = result.insertId;
    	shahokokuho.shahokokuho_id = shahokokuhoId;
    	cb(undefined, shahokokuhoId);
    });
};

exports.getShahokokuho = function(conn, shahokokuhoId, cb){
	var sql = "select * from hoken_shahokokuho where shahokokuho_id = ?";
	conn.query(sql, [shahokokuhoId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var shahokokuho = result[0];
			util.deleteUnusedShahokokuhoColumn(shahokokuho);
			cb(undefined, shahokokuho);
			return;
		}
		cb("getShahokokuho failed");
	})
};

exports.findShahokokuho = function(conn, shahokokuhoId, cb){
	var sql = "select * from hoken_shahokokuho where shahokokuho_id = ?";
	conn.query(sql, [shahokokuhoId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var shahokokuho = result[0];
			util.deleteUnusedShahokokuhoColumn(shahokokuho);
			cb(undefined, shahokokuho);
			return;
		}
		if( result.length === 0 ){
			cb(undefined, null);
			return;
		}
		cb("findShahokokuho failed");
	})
};

exports.updateShahokokuho = function(conn, shahokokuho, cb){
	var sql = "update hoken_shahokokuho set hokensha_bangou = ?, " +
        " hihokensha_kigou = ?, hihokensha_bangou = ?, honnin = ?, kourei = ?, " +
        " valid_from = ?, valid_upto = ? where shahokokuho_id = ?";
    var args = [
        shahokokuho.hokensha_bangou,
        shahokokuho.hihokensha_kigou, shahokokuho.hihokensha_bangou, 
        shahokokuho.honnin, shahokokuho.kourei,
        shahokokuho.valid_from, shahokokuho.valid_upto, shahokokuho.shahokokuho_id
    ];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateShahokokuho failed");
    });
};

exports.deleteShahokokuho = function(conn, shahokokuhoId, cb){
	var sql = "delete from hoken_shahokokuho where shahokokuho_id = ?";
	conn.query(sql, [shahokokuhoId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteShahokokuho failed");
	})
};

exports.listAvailableShahokokuho = function(conn, patientId, at, cb){
    var sql = "select * from hoken_shahokokuho where patient_id = ? " +
        " and valid_from <= date(?) " +
        " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) " +
        " order by shahokokuho_id ";
    var args = [patientId, at, at];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	result.forEach(util.deleteUnusedShahokokuhoColumn);
    	cb(undefined, result);
    })
}