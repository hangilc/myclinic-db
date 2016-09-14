"use strict";

exports.insertPharmaQueue = function(conn, queue, cb){
    var sql = "insert into pharma_queue set pharma_state = ?, visit_id = ?";
    var args = [queue.pharma_state, queue.visit_id];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	cb(undefined, result.insertId);
    })
};

exports.findPharmaQueue = function(conn, visitId, cb){
	var sql = "select * from pharma_queue where visit_id = ? limit 2";
	var args = [visitId];
	conn.query(sql, args, function(err, result){
		if( err ){
			done(err);
			return;
		}
		if( result.length === 0 ){
			cb(undefined, null);
			return;
		} else if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		} else {
			cb("findPharmaQueue failed");
		}
	})
};

exports.getPharmaQueue = function(conn, visitId, cb){
	exports.findPharmaQueue(conn, visitId, function(err, result){
		if( err ){
			done(err);
			return;
		}
		if( result === null ){
			cb("getPharmaQueue failed");
			return;
		} else {
			cb(undefined, result);
		}
	})
};

exports.updatePharmaQueue = function(conn, queue, done){
    var sql = "update pharma_queue set pharma_state = ? where visit_id = ?";
    var args = [queue.pharma_state, queue.visit_id];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		done(err);
    		return;
    	}
    	if( result.affectedRows !== 1 ){
    		done("updatePharmaQueue failed");
    		return;
    	}
    	done();
    })
};

exports.tryDeletePharmaQueue = function(conn, visitId, cb){
	var sql = "delete from pharma_queue where visit_id = ?";
	var args = [visitId];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		switch(result.affectedRows){
			case 0: cb(undefined, false); return;
			case 1: cb(undefined, true); return;
			default: cb("deletePharmaQueue failed: " + result.length); return;
		}
	});
};

exports.deletePharmaQueue = function(conn, visitId, done){
	exports.tryDeletePharmaQueue(conn, visitId, function(err, result){
		if( err ){
			done(err);
			return;
		}
		if( result === false ){
			done("deltePharmaQueue failed");
			return;
		}
		done();
	})
};

exports.listFullPharmaQueue = function(conn, cb){
    var sql = "select q.*, p.last_name, p.first_name, p.last_name_yomi, p.first_name_yomi, wq.wait_state, " + 
        " p.patient_id " +
        " from pharma_queue q, visit v, patient p, wqueue wq " +
        " where q.visit_id = v.visit_id and v.patient_id = p.patient_id " + 
        " and wq.visit_id = q.visit_id " +
        " order by q.visit_id ";
    conn.query(sql, [], cb);
};

exports.listTodaysVisitsForPharma = function(conn, cb){
    var sql = "select v.visit_id, p.last_name, p.first_name, p.last_name_yomi, p.first_name_yomi, wq.wait_state " + 
        " from (visit v, patient p) left outer join wqueue wq on v.visit_id = wq.visit_id " +
        " where date(v.v_datetime) = date(now()) and v.patient_id = p.patient_id " +
        " order by v.visit_id";
    conn.query(sql, [], cb);
};

