"use strict";

exports.insertDiseaseAdj = function(conn, adj, cb){
	var sql = "insert into disease_adj set disease_id = ?, shuushokugocode = ?";
	var args = [adj.disease_id, adj.shuushokugocode];
	conn.query(sql, args, function(err, result){
		if( err ){
			done(err);
			return;
		}
		adj.disease_adj_id = result.insertId;
		cb(undefined, result.insertId);
	});
};

exports.getDiseaseAdj = function(conn, diseaseAdjId, cb){
	var sql = "select * from disease_adj where disease_adj_id = ?";
	var args = [diseaseAdjId];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getDiseaseAdj failed: " + result.length);
	})
};

exports.updateDiseaseAdj = function(conn, adj, done){
	var sql = "update disease_adj set disease_id = ?, shuushokugocode = ? where disease_adj_id = ?";
	var args = [adj.disease_id, adj.shuushokugocode, adj.disease_adj_id];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		done(err);
    		return;
    	}
    	if( result.affectedRows !== 1 ){
    		done("updateDiseaseAdj failed: " + result.affectedRows);
    		return;
    	}
    	done();
    });
};

exports.deleteDiseaseAdj = function(conn, diseaseAdjId, done){
	var sql = "delete from disease_adj where disease_adj_id = ?";
	var args = [diseaseAdjId];
	conn.query(sql, args, function(err, result){
		if( err ){
			done(err);
			return;
		}
		if( result.affectedRows !== 1 ){
			done("deleteDiseaseAdj failed");
			return;
		}
		done();
	})
};

exports.listDiseaseAdjForDisease = function(conn, diseaseId, cb){
	var sql = "select * from disease_adj where disease_id = ? order by disease_adj_id";
	var args = [diseaseId];
	conn.query(sql, args, cb);
};

