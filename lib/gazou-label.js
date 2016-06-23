"use strict";

exports.insertGazouLabel = function(conn, gazouLabel, cb){
    var sql = "insert into visit_gazou_label set visit_conduct_id = ?, label = ?";
    var args = [gazouLabel.visit_conduct_id, gazouLabel.label];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	cb();
    });
};

exports.getGazouLabel = function(conn, conductId, cb){
	var sql = "select * from visit_gazou_label where visit_conduct_id = ?";
	conn.query(sql, [conductId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getGazouLabel failed");
	})
};

exports.findGazouLabel = function(conn, conductId, cb){
	var sql = "select * from visit_gazou_label where visit_conduct_id = ?";
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
		cb("findGazouLabel failed");
	})
};

exports.updateGazouLabel = function(conn, gazouLabel, cb){
    var sql = "update visit_gazou_label set label = ? where visit_conduct_id = ?";
    var args = [gazouLabel.label, gazouLabel.visit_conduct_id];
	conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateGazouLabel failed");
    });
};

exports.deleteGazouLabel = function(conn, conductId, cb){
	var sql = "delete from visit_gazou_label where visit_conduct_id = ?";
	conn.query(sql, [conductId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteGazouLabel failed");
	})
};
