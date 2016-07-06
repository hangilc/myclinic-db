"use strict";

exports.insertShuushokugoMaster = function(conn, master, done){
	var sql = "insert into shuushokugo_master set shuushokugocode = ?, name = ? ";
	var args = [master.shuushokugocode, master.name];
	conn.query(sql, args, done);
};

exports.findShuushokugoMaster = function(conn, shuushokugocode, cb){
	var sql = "select * from shuushokugo_master where shuushokugocode = ? "
	var args = [shuushokugocode];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		switch(result.length){
			case 0: cb(undefined, null); return;
			case 1: cb(undefined, result[0]); return;
			default: cb("findShuushokugoMaster failed"); return;
		}
	});
};

exports.getShuushokugoMaster = function(conn, shuushokugocode, cb){
	exports.findShuushokugoMaster(conn, shuushokugocode, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result === null ){
			cb("cannot find row (getShuushokugoMaster)");
			return;
		}
		cb(undefined, result);
	});
};

exports.searchShuushokugoMaster = function(conn, text, cb){
    var sql = "select * from shuushokugo_master where name like ? order by name";
    var args = ["%" + text + "%"];
    conn.query(sql, args, cb);
};