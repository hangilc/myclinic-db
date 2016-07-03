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

exports.deletePharmaQueue = function(conn, visitId, done){
	var sql = "delete from pharma_queue where visit_id = ?";
	var args = [visitId];
	conn.query(sql, args, function(err, result){
		if( err ){
			done(err);
			return;
		}
		if( result.affectedRows !== 1 ){
			done("deletePharmaQueue failed: " + result.length);
			return;
		}
		done();
	});
};