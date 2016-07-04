"use strict";

exports.insertConduct = function(conn, conduct, cb){
    var sql = "insert into visit_conduct set visit_id = ?, kind = ?";
    var args = [conduct.visit_id, conduct.kind];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var conductId = result.insertId;
    	conduct.id = conductId;
    	cb(undefined, conductId);
    });
};

exports.getConduct = function(conn, conductId, cb){
	var sql = "select * from visit_conduct where id = ?";
	conn.query(sql, [conductId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getConduct failed");
	})
};

exports.findConduct = function(conn, conductId, cb){
	var sql = "select * from visit_conduct where id = ?";
	conn.query(sql, [conductId], function(err, result){
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
		cb("findConduct failed");
	})
};

exports.updateConduct = function(conn, conduct, cb){
    var sql = "update visit_conduct set visit_id = ?, kind = ? where id = ?";
    var args = [conduct.visit_id, conduct.kind, conduct.id];
	conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateConduct failed");
    });
};

exports.deleteConduct = function(conn, conductId, cb){
	var sql = "delete from visit_conduct where id = ?";
	conn.query(sql, [conductId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteConduct failed");
	})
};

exports.listConductsForVisit = function(conn, visitId, cb){
	var sql = "select * from visit_conduct where visit_id = ? order by id";
	var args = [visitId];
	conn.query(sql, args, cb);
};

exports.countConductsForVisit = function(conn, visitId, cb){
	var sql = "select count(*) as c from visit_conduct where visit_id = ?";
	var args = [visitId];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, result[0].c);
	})
}