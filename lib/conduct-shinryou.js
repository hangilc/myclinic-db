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

exports.listFullShinryouForConduct = function(conn, conductId, at, cb){
	var sql = "select s.*, m.* from visit_conduct_shinryou s, shinryoukoui_master_arch m " +
		" where s.visit_conduct_id = ? and s.shinryoucode = m.shinryoucode " +
		" and m.valid_from <= date(?) " +
		" and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(?)) " +
		" order by s.id ";
	var args = [conductId, at, at];
	conn.query(sql, args, cb);
};

exports.listConductShinryouForConduct = function(conn, conductId, cb){
	var sql = "select * from visit_conduct_shinryou where visit_conduct_id = ? order by id";
	var args = [conductId];
	conn.query(sql, args, cb);
};

exports.countConductShinryouForConduct = function(conn, conductId, cb){
	var sql = "select count(*) as c from visit_conduct_shinryou where visit_conduct_id = ?";
	var args = [conductId];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, result[0].c);
	})
};