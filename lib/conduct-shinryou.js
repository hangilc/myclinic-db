"use strict";

exports.insertConductShinryou = function(conn, conductShinryou, cb){
    var sql = "insert into visit_conduct_shinryou set visit_conduct_id = ?, shinryoucode = ?";
    var args = [conductShinryou.visit_conduct_id, conductShinryou.shinryoucode];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var conductShinryouId = result.insertId;
    	conductShinryou.id = conductShinryouId;
    	cb(undefined, conductShinryouId);
    });
};

exports.getConductShinryou = function(conn, conductShinryouId, cb){
	var sql = "select * from visit_conduct_shinryou where id = ?";
	conn.query(sql, [conductShinryouId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getConductShinryou failed");
	})
};

exports.findConductShinryou = function(conn, conductShinryouId, cb){
	var sql = "select * from visit_conduct_shinryou where id = ?";
	conn.query(sql, [conductShinryouId], function(err, result){
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
		cb("findConductShinryou failed");
	})
};

exports.updateConductShinryou = function(conn, conductShinryou, cb){
    var sql = "update visit_conduct_shinryou set visit_conduct_id = ?, shinryoucode = ? where id = ?";
    var args = [conductShinryou.visit_conduct_id, conductShinryou.shinryoucode, conductShinryou.id];
	conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateConductShinryou failed");
    });
};

exports.deleteConductShinryou = function(conn, conductShinryouId, cb){
	var sql = "delete from visit_conduct_shinryou where id = ?";
	conn.query(sql, [conductShinryouId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteConductShinryou failed");
	})
};