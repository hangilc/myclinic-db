"use strict";

exports.insertConductKizai = function(conn, conductKizai, cb){
    var sql = "insert into visit_conduct_kizai set visit_conduct_id = ?, kizaicode = ?, amount = ?";
    var args = [conductKizai.visit_conduct_id, conductKizai.kizaicode, conductKizai.amount];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var conductKizaiId = result.insertId;
    	conductKizai.id = conductKizaiId;
    	cb(undefined, conductKizaiId);
    });
};

exports.getConductKizai = function(conn, conductKizaiId, cb){
	var sql = "select * from visit_conduct_kizai where id = ?";
	conn.query(sql, [conductKizaiId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getConductKizai failed");
	})
};

exports.findConductKizai = function(conn, conductKizaiId, cb){
	var sql = "select * from visit_conduct_kizai where id = ?";
	conn.query(sql, [conductKizaiId], function(err, result){
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
		cb("findConductKizai failed");
	})
};

exports.updateConductKizai = function(conn, conductKizai, cb){
    var sql = "update visit_conduct_kizai set visit_conduct_id = ?, kizaicode = ?, amount = ? where id = ?";
    var args = [conductKizai.visit_conduct_id, conductKizai.kizaicode, conductKizai.amount, conductKizai.id];
	conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateConductKizai failed");
    });
};

exports.deleteConductKizai = function(conn, conductKizaiId, cb){
	var sql = "delete from visit_conduct_kizai where id = ?";
	conn.query(sql, [conductKizaiId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteConductKizai failed");
	})
};