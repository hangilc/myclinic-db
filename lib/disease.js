"use strict";

var util = require("./util");

exports.insertDisease = function(conn, disease, cb){
    var sql = "insert into disease set patient_id = ?, shoubyoumeicode = ?, " + 
    	" start_date = ?, end_date = ?, end_reason = ? ";
    var args = [disease.patient_id, disease.shoubyoumeicode, 
    	disease.start_date, 
    	disease.end_date || "0000-00-00", 
    	disease.end_reason !== undefined ? disease.end_reason : util.DiseaseEndReasonNotEnded];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var insertId = result.insertId;
    	disease.disease_id = insertId;
    	cb(undefined, insertId);
    })
};

exports.getDisease = function(conn, diseaseId, cb){
	var sql = "select * from disease where disease_id = ?";
	var args = [diseaseId];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getDisease failed: " + result.length);
	})
};

exports.updateDisease = function(conn, disease, done){
    var sql = "update disease set patient_id = ?, shoubyoumeicode = ?, " + 
    	" start_date = ?, end_date = ?, end_reason = ? where disease_id = ?";
    var args = [disease.patient_id, 
    	disease.shoubyoumeicode, 
    	disease.start_date, 
    	disease.end_date || "0000-00-00", 
    	disease.end_reason !== undefined ? disease.end_reason : util.DiseaseEndReasonNotEnded,
    	disease.disease_id];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		done(err);
    		return;
    	}
    	if( result.affectedRows !== 1 ){
    		done("updateDisease failed: " + result.affectedRows);
    		return;
    	}
    	done();
    });
};

exports.deleteDisease = function(conn, diseaseId, done){
	var sql = "delete from disease where disease_id = ?";
	var args = [diseaseId];
	conn.query(sql, args, function(err, result){
		if( err ){
			done(err);
			return;
		}
		if( result.affectedRows !== 1 ){
			done("deleteDisease failed");
			return;
		}
		done();
	})
};

exports.searchDisease = function(conn, text, at, cb){
    var sql = "select * from shoubyoumei_master_arch " +
            " where name like ? and valid_from <= date(?) " +
            " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) ";
    var args = ["%" + text + "%", at, at];
    conn.query(sql, args, cb);
}