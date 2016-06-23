"use strict";

exports.insertConductDrug = function(conn, conductDrug, cb){
    var sql = "insert into visit_conduct_drug set visit_conduct_id = ?, iyakuhincode = ?, amount = ?";
    var args = [conductDrug.visit_conduct_id, conductDrug.iyakuhincode, conductDrug.amount];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var conductDrugId = result.insertId;
    	conductDrug.id = conductDrugId;
    	cb(undefined, conductDrugId);
    });
};

exports.getConductDrug = function(conn, conductDrugId, cb){
	var sql = "select * from visit_conduct_drug where id = ?";
	conn.query(sql, [conductDrugId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getConductDrug failed");
	})
};

exports.findConductDrug = function(conn, conductDrugId, cb){
	var sql = "select * from visit_conduct_drug where id = ?";
	conn.query(sql, [conductDrugId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		if( result.length === 0 ){
			cb(undefined, null);
			return;
		}
		cb("findConductDrug failed");
	})
};

exports.updateConductDrug = function(conn, conductDrug, cb){
    var sql = "update visit_conduct_drug set visit_conduct_id = ?, iyakuhincode = ?, amount = ? where id = ?";
    var args = [conductDrug.visit_conduct_id, conductDrug.iyakuhincode, conductDrug.amount, conductDrug.id];
	conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateConductDrug failed");
    });
};

exports.deleteConductDrug = function(conn, conductDrugId, cb){
	var sql = "delete from visit_conduct_drug where id = ?";
	conn.query(sql, [conductDrugId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteConductDrug failed");
	})
};