"use strict";

exports.insertWqueue = function(conn, wqueue, cb){
    var sql = "insert into wqueue set wait_state = ?, visit_id = ?";
    var args = [wqueue.wait_state, wqueue.visit_id];
    conn.query(sql, args, cb);
};

exports.getWqueue = function(conn, visitId, cb){
	var sql = "select * from wqueue where visit_id = ?";
	conn.query(sql, [visitId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getWqueue failed");
	})
};

exports.findWqueue = function(conn, visitId, cb){
	var sql = "select * from wqueue where visit_id = ?";
	conn.query(sql, [visitId], function(err, result){
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
		cb("findWqueue failed");
	})
};

exports.updateWqueue = function(conn, wqueue, cb){
    var sql = "update wqueue set wait_state = ? where visit_id = ?";
    var args = [wqueue.wait_state, wqueue.visit_id];
	conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateWqueue failed");
    });
};

exports.deleteWqueue = function(conn, visitId, cb){
	var sql = "delete from wqueue where visit_id = ?";
	conn.query(sql, [visitId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteWqueue failed");
	})
};

exports.listWqueue = function(conn, cb){
	var sql = "select * from wqueue order by visit_id";
	var args = [];
	conn.query(sql, args, cb);
}