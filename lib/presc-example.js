"use strict";

var util = require("./util");

exports.insertPrescExample = function(conn, ex, cb){
    var sql = "insert into presc_example set m_iyakuhincode = ?, m_master_valid_from = ?, " +
        " m_amount = ?, m_usage = ?, m_days = ?, m_category = ?, m_comment = ?";
    var args = [ex.m_iyakuhincode, ex.m_master_valid_from, ex.m_amount, ex.m_usage, ex.m_days, ex.m_category, ex.m_comment];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	ex.presc_example_id = result.insertId;
    	cb(undefined, result.insertId);
    });
};

exports.getPrescExample = function(conn, prescExampleId, cb){
	var sql = "select * from presc_example where presc_example_id = ?";
	var args = [prescExampleId];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var ex = result[0];
			util.deleteUnusedPrescExampleColumn(ex);
			cb(undefined, ex);
			return;
		}
		cb("getPrescExample failed");
	});
};

exports.updatePrescExample = function(conn, ex, done){
    var sql = "update presc_example set m_iyakuhincode = ?, m_master_valid_from = ?, " +
        " m_amount = ?, m_usage = ?, m_days = ?, m_category = ?, m_comment = ? where presc_example_id = ?";
    var args = [ex.m_iyakuhincode, ex.m_master_valid_from, ex.m_amount, ex.m_usage, ex.m_days, ex.m_category, ex.m_comment,
    	ex.presc_example_id];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		done(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		done();
    		return;
    	}
    	done("updatePrescExample failed");
    });
};

exports.deletePrescExample = function(conn, prescExampleId, done){
	var sql = "delete from presc_example where presc_example_id = ?";
	var args = [prescExampleId];
	conn.query(sql, args, function(err, result){
		if( err ){
			done(err);
			return;
		}
		if( result.affectedRows === 1 ){
			done();
			return;
		}
		done("deletePrescExample failed");
	});
};