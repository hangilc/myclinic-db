"use strict";

var util = require("./util");

exports.insertRoujin = function(conn, roujin, cb){
    var sql = "insert into hoken_roujin set patient_id = ?, shichouson = ?, " +
        " jukyuusha = ?, futan_wari = ?, " +
        " valid_from = ?, valid_upto = ?";
    var args = [
        roujin.patient_id, roujin.shichouson,
        roujin.jukyuusha, 
        roujin.futan_wari,
        roujin.valid_from, roujin.valid_upto
    ];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var roujinId = result.insertId;
    	roujin.roujin_id = roujinId;
    	cb(undefined, roujinId);
    });
};

exports.getRoujin = function(conn, roujinId, cb){
	var sql = "select * from hoken_roujin where roujin_id = ?";
	conn.query(sql, [roujinId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var roujin = result[0];
			util.deleteUnusedRoujinColumn(roujin);
			cb(undefined, roujin);
			return;
		}
		cb("getRoujin failed");
	})
};

exports.findRoujin = function(conn, roujinId, cb){
	var sql = "select * from hoken_roujin where roujin_id = ?";
	conn.query(sql, [roujinId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var roujin = result[0];
			util.deleteUnusedRoujinColumn(roujin);
			cb(undefined, roujin);
			return;
		}
		if( result.length === 0 ){
			cb(undefined, null);
			return;
		}
		cb("findRoujin failed");
	})
};

exports.updateRoujin = function(conn, roujin, cb){
    var sql = "update hoken_roujin set patient_id = ?, shichouson = ?, " +
        " jukyuusha = ?, futan_wari = ?, " +
        " valid_from = ?, valid_upto = ? where roujin_id = ? ";
    var args = [
        roujin.patient_id, roujin.shichouson,
        roujin.jukyuusha, 
        roujin.futan_wari,
        roujin.valid_from, roujin.valid_upto, 
        roujin.roujin_id
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
    	cb("updateRoujin failed");
    });
};

exports.deleteRoujin = function(conn, roujinId, cb){
	var sql = "delete from hoken_roujin where roujin_id = ?";
	conn.query(sql, [roujinId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteRoujin failed");
	})
};

exports.listAvailableRoujin = function(conn, patientId, at, cb){
   var sql = "select * from hoken_roujin where patient_id = ? " +
        " and valid_from <= date(?) " +
        " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) " +
        " order by roujin_id ";
    var args = [patientId, at, at];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	result.forEach(util.deleteUnusedRoujinColumn);
    	cb(undefined, result);
    })
}

exports.listRoujin = function(conn, patientId, cb){
   var sql = "select * from hoken_roujin where patient_id = ? " +
        " order by roujin_id ";
    var args = [patientId];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	result.forEach(util.deleteUnusedRoujinColumn);
    	cb(undefined, result);
    })
}
