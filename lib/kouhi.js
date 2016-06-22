"use strict";

exports.insertKouhi = function(conn, kouhi, cb){
    var sql = "insert into kouhi set patient_id = ?, futansha = ?, " +
        " jukyuusha = ?, " +
        " valid_from = ?, valid_upto = ?";
    var args = [
        kouhi.patient_id, kouhi.futansha,
        kouhi.jukyuusha, 
        kouhi.valid_from, kouhi.valid_upto
    ];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var kouhiId = result.insertId;
    	kouhi.kouhi_id = kouhiId;
    	cb(undefined, kouhiId);
    });
};

exports.getKouhi = function(conn, kouhiId, cb){
	var sql = "select * from kouhi where kouhi_id = ?";
	conn.query(sql, [kouhiId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getKouhi failed");
	})
};

exports.findKouhi = function(conn, kouhiId, cb){
	var sql = "select * from kouhi where kouhi_id = ?";
	conn.query(sql, [kouhiId], function(err, result){
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
		cb("findKouhi failed");
	})
};

exports.updateKouhi = function(conn, kouhi, cb){
    var sql = "update kouhi set patient_id = ?, futansha = ?, " +
        " jukyuusha = ?, " +
        " valid_from = ?, valid_upto = ? where kouhi_id = ? ";
    var args = [
        kouhi.patient_id, kouhi.futansha,
        kouhi.jukyuusha, 
        kouhi.valid_from, kouhi.valid_upto, 
        kouhi.kouhi_id
    ];
	conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateKouhi failed");
    });
};

exports.deleteKouhi = function(conn, kouhiId, cb){
	var sql = "delete from kouhi where kouhi_id = ?";
	conn.query(sql, [kouhiId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteKouhi failed");
	})
};
