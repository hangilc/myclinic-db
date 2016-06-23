"use strict";

exports.insertDrug = function(conn, drug, cb){
    var sql = "insert into visit_drug set visit_id = ?, d_iyakuhincode = ?, d_amount = ?, " + 
        "d_usage = ?, d_days = ?, d_category = ?, d_prescribed = 0";
    var args = [
    	drug.visit_id, drug.d_iyakuhincode, drug.d_amount, 
    	drug.d_usage, drug.d_days, drug.d_category
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
			cb(undefined, result[0]);
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
			cb(undefined, result[0]);
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