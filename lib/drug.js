"use strict";

var util = require("./util");

exports.insertDrug = function(conn, drug, cb){
    var sql = "insert into visit_drug set visit_id = ?, d_iyakuhincode = ?, d_amount = ?, " + 
        "d_usage = ?, d_days = ?, d_category = ?, d_prescribed = ?";
    var args = [
    	drug.visit_id, drug.d_iyakuhincode, drug.d_amount, 
    	drug.d_usage, drug.d_days, drug.d_category, 
    	drug.d_prescribed === undefined ? 0 : drug.d_prescribed
    ];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var drugId = result.insertId;
    	drug.drug_id = drugId;
    	cb(undefined, drugId);
    });
};

exports.getDrug = function(conn, drugId, cb){
	var sql = "select * from visit_drug where drug_id = ?";
	conn.query(sql, [drugId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var drug = result[0];
			util.deleteUnusedDrugColumn(drug);
			cb(undefined, drug);
			return;
		}
		cb("getDrug failed");
	})
};

exports.findDrug = function(conn, drugId, cb){
	var sql = "select * from visit_drug where drug_id = ?";
	conn.query(sql, [drugId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var drug = result[0];
			util.deleteUnusedDrugColumn(drug);
			cb(undefined, drug);
			return;
		}
		if( result.length === 0 ){
			cb(undefined, null);
			return;
		}
		cb("findDrug failed");
	})
};

exports.updateDrug = function(conn, drug, cb){
    var sql = "update visit_drug set visit_id = ?, d_iyakuhincode = ?, d_amount = ?, " + 
        "d_usage = ?, d_days = ?, d_category = ?, d_prescribed = ? where drug_id = ?";
    var args = [
    	drug.visit_id, drug.d_iyakuhincode, drug.d_amount, 
    	drug.d_usage, drug.d_days, drug.d_category, drug.d_prescribed, drug.drug_id
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
    	cb("updateDrug failed");
    });
};

exports.deleteDrug = function(conn, drugId, cb){
	var sql = "delete from visit_drug where drug_id = ?";
	conn.query(sql, [drugId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteDrug failed");
	})
};

exports.getFullDrug = function(conn, drugId, at, cb){
	var sql = "select d.*, m.* from visit_drug d, iyakuhin_master_arch m " +
		" where d.drug_id = ? and m.iyakuhincode = d.d_iyakuhincode " +
		" and m.valid_from <= date(?) " +
		" and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(?))";
	conn.query(sql, [drugId, at, at], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var drug = result[0];
			util.deleteUnusedDrugColumn(drug);
			util.deleteUnusedIyakuhinMasterColumn(drug);
			cb(undefined, drug);
			return;
		}
		cb("getFullDrug failed");
	})
};