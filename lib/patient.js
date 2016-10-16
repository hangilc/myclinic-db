"use strict";

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

function searchPatient1(conn, text, cb){
	var sql = "select * from patient where last_name like ? or first_name like ? " +
		" or last_name_yomi like ? or first_name_yomi like ? order by last_name_yomi, first_name_yomi";
	var t = "%" + text + "%";
	conn.query(sql, [t, t, t, t], cb);
};

function searchPatient2(conn, text1, text2, cb){
	var sql = "select * from patient where (last_name like ? or last_name_yomi like ?) " +
		" and (first_name like ? or first_name_yomi like ?) order by last_name_yomi, first_name_yomi";
	var t1 = "%" + text1 + "%";
	var t2 = "%" + text2 + "%";
	conn.query(sql, [t1, t1, t2, t2], cb);
}

exports.searchPatient = function(conn, text, cb){
	text = text.trim();
	if( text === "" ){
		cb(undefined, []);
		return;
	}
	if( text.match(/^\d+$/) ){
		exports.findPatient(conn, +text, function(err, patient){
			if( err ){
				cb(err);
				return;
			}
			if( patient === null ){
				cb(undefined, []);
			} else {
				cb(undefined, [patient]);
			}
		});
	} else {
		var m = text.match(/(\S+)\s+(\S+)/);
		if( m ){
			searchPatient2(conn, m[1], m[2], cb);
		} else {
			searchPatient1(conn, text, cb);
		}
	}
}
