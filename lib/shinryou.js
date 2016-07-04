"use strict";

exports.insertShinryou = function(conn, shinryou, cb){
    var sql = "insert into visit_shinryou set visit_id = ?, shinryoucode = ?";
    var args = [shinryou.visit_id, shinryou.shinryoucode];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var shinryouId = result.insertId;
    	shinryou.shinryou_id = shinryouId;
    	cb(undefined, shinryouId);
    });
};

exports.getShinryou = function(conn, shinryouId, cb){
	var sql = "select * from visit_shinryou where shinryou_id = ?";
	conn.query(sql, [shinryouId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getShinryou failed");
	})
};

exports.findShinryou = function(conn, shinryouId, cb){
	var sql = "select * from visit_shinryou where shinryou_id = ?";
	conn.query(sql, [shinryouId], function(err, result){
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
		cb("findShinryou failed");
	})
};

exports.updateShinryou = function(conn, shinryou, cb){
    var sql = "update visit_shinryou set shinryoucode = ? where shinryou_id = ?";
    var args = [shinryou.shinryoucode, shinryou.shinryou_id];
	conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateShinryou failed");
    });
};

exports.deleteShinryou = function(conn, shinryouId, cb){
	var sql = "delete from visit_shinryou where shinryou_id = ?";
	conn.query(sql, [shinryouId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteShinryou failed");
	})
};

exports.getFullShinryou = function(conn, shinryouId, at, cb){
	var sql = "select s.*, m.* from visit_shinryou s, shinryoukoui_master_arch m " +
		" where s.shinryou_id = ? and s.shinryoucode = m.shinryoucode " +
		" and m.valid_from <= date(?) " +
		" and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(?))"
	var args = [shinryouId, at, at];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getFullShinryou failed: " + result.length);
	})
};

exports.listFullShinryouForVisit = function(conn, visitId, at, cb){
	var sql = "select s.*, m.* from visit_shinryou s, shinryoukoui_master_arch m " +
		" where s.visit_id = ? and s.shinryoucode = m.shinryoucode " +
		" and m.valid_from <= date(?) " +
		" and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(?))"
	var args = [visitId, at, at];
	conn.query(sql, args, cb);
};

exports.countShinryouForVisit = function(conn, visitId, cb){
	var sql = "select count(*) as c from visit_shinryou where visit_id = ?";
	var args = [visitId];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, result[0].c);
	})
};
