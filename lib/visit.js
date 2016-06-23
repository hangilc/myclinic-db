"use strict";

exports.insertVisit = function(conn, visit, cb){
    var sql = "insert into visit set patient_id = ?, " +
        "v_datetime = ?, shahokokuho_id = ?, " +
        "roujin_id = 0, koukikourei_id = ?, " +
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
			cb(undefined, result[0]);
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
			cb(undefined, result[0]);
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

exports.recentVisits = function(conn, cb){
    var sql = "select p.patient_id, p.last_name, p.first_name, p.last_name_yomi, p.first_name_yomi, " + 
        " v.visit_id " + 
        " from visit v, patient p where v.patient_id = p.patient_id order by visit_id desc limit 30";
    conn.query(sql, cb);
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