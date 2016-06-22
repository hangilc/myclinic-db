"use strict";

var mysql = require("mysql");

exports.insertPatient = function(conn, patient, cb){
    var sql = "insert into patient set last_name = ?, first_name = ?, " +
        " last_name_yomi = ?, first_name_yomi = ?, birth_day = date(?), " +
        " sex = ?, phone = ?, address = ?";
    conn.query(sql, [patient.last_name, patient.first_name, patient.last_name_yomi,
        patient.first_name_yomi, patient.birth_day, patient.sex, patient.phone,
        patient.address], function(err, result){
        	if( err ){
        		cb(err);
        		return;
        	}
        	patient.patient_id = result.insertId;
        	cb(undefined, result.insertId);
        });
};

exports.getPatient = function(conn, patientId, cb){
	var sql = "select * from patient where patient_id = ?";
	conn.query(sql, [patientId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
		} else {
			cb("getPatient failed");
		}
	})
};

exports.findPatient = function(conn, patientId, cb){
	var sql = "select * from patient where patient_id = ?";
	conn.query(sql, [patientId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
		} else if( result.length === 0 ){
			cb(undefined, null);
		} else {
			cb("getPatient failed");
		}
	})
};

exports.updatePatient = function(conn, patient, cb){
    var sql = "update patient set last_name = ?, first_name = ?, " +
        " last_name_yomi = ?, first_name_yomi = ?, birth_day = date(?), " +
        " sex = ?, phone = ?, address = ? where patient_id = ?";
    conn.query(sql, [patient.last_name, patient.first_name, patient.last_name_yomi,
        patient.first_name_yomi, patient.birth_day, patient.sex, patient.phone,
        patient.address, patient.patient_id], function(err, result){
        	if( err ){
        		cb(err);
        		return;
        	}
        	if( result.affectedRows !== 1 ){
        		cb("updatePatient failed");
        		return;
        	}
        	cb();
        });
};

exports.deletePatient = function(conn, patientId, cb){
	var sql = "delete from patient where patient_id = ?";
	conn.query(sql, [patientId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb(undefined);
		} else {
			cb("deletePatient failed");
		}
	})
};