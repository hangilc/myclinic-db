"use strict";

exports.insertPharmaDrug = function(conn, data, done){
	var sql = "insert into pharma_drug set iyakuhincode = ?, " +
		" description = ?, sideeffect = ? ";
	var args = [data.iyakuhincode, data.description, data.sideeffect];
	conn.query(sql, args, done);
};

exports.getPharmaDrug = function(conn, iyakuhincode, cb){
	var sql = "select * from pharma_drug where iyakuhincode = ?";
	var args = [iyakuhincode];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length !== 1 ){
			cb("getPharmaDrug failed");
			return;
		}
		cb(undefined, result[0]);
	});
};