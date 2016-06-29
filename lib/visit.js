"use strict";

var util = require("./util");

exports.insertVisit = function(conn, visit, cb){
    var sql = "insert into visit set patient_id = ?, " +
        "v_datetime = ?, shahokokuho_id = ?, " +
        "roujin_id = ?, koukikourei_id = ?, " +
        "kouhi_1_id = ?, kouhi_2_id = ?, kouhi_3_id = ? ";
    var args = [visit.patient_id, visit.v_datetime, visit.shahokokuho_id,
    	visit.roujin_id, visit.koukikourei_id,
    	visit.kouhi_1_id, visit.kouhi_2_id, visit.kouhi_3_id];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	visit.visit_id = result.insertId;
    	cb(undefined, result.insertId);
    })
};

exports.findVisit = function(conn, visitId, cb){
	var sql = "select * from visit where visit_id = ?";
	conn.query(sql, [visitId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 0 ){
			cb(undefined, null);
			return;
		}
		if( result.length === 1 ){
			var visit = result[0];
			util.deleteUnusedVisitColumn(visit);
			cb(undefined, visit);
			return;
		}
		cb("findVisit failed");
	})
}

exports.getVisit = function(conn, visitId, cb){
	var sql = "select * from visit where visit_id = ?";
	conn.query(sql, [visitId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var visit = result[0];
			util.deleteUnusedVisitColumn(visit);
			cb(undefined, visit);
			return;
		}
		cb("getVisit failed");
	})
}

exports.updateVisit = function(conn, visit, cb){
    var sql = "update visit set " +
        "shahokokuho_id = ?, " +
        "roujin_id = ?, koukikourei_id = ?, " +
        "kouhi_1_id = ?, kouhi_2_id = ?, kouhi_3_id = ? where visit_id = ?";
    var args = [visit.shahokokuho_id,
    	visit.roujin_id, visit.koukikourei_id,
    	visit.kouhi_1_id, visit.kouhi_2_id, visit.kouhi_3_id, visit.visit_id];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateVisit failed");
    })
}

exports.deleteVisit = function(conn, visitId, cb){
	var sql = "delete from visit where visit_id = ?";
	conn.query(sql, [visitId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("updateVisit failed");
	});
};

exports.calcVisits = function(conn, patientId, cb){
	var sql = "select count(*) as c from visit where patient_id = ?";
	conn.query(sql, [patientId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0].c);
			return;
		}
		cb("calcVisits failed");
	});
};

exports.listVisitsForPatient = function(conn, patientId, offset, n, cb){
	var sql = "select * from visit where patient_id = ? order by visit_id desc limit ?,? ";
	var args = [patientId, offset, n];
	conn.query(sql, args, function(err, result){
		if( err ){
			done(err);
			return;
		}
		result.forEach(util.deleteUnusedVisitColumn);
		cb(undefined, result);
	});
}



