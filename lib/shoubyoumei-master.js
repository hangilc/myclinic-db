"use strict";

exports.insertShoubyoumeiMaster = function(conn, master, done){
	var sql = "insert into shoubyoumei_master_arch set shoubyoumeicode = ?, " +
		" name = ?, valid_from = ?, valid_upto = ? ";
	var args = [master.shoubyoumeicode, master.name, master.valid_from, master.valid_upto];
	conn.query(sql, args, done);
};

exports.findShoubyoumeiMaster = function(conn, shoubyoumeicode, at, cb){
	var sql = "select * from shoubyoumei_master_arch where shoubyoumeicode = ? " +
		" and valid_from <= date(?) " +
		" and (valid_upto = '0000-00-00' or valid_upto >= date(?)) ";
	var args = [shoubyoumeicode, at, at];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		switch(result.length){
			case 0: cb(undefined, null); return;
			case 1: cb(undefined, result[0]); return;
			default: cb("findShoubyoumeiMaster failed"); return;
		}
	});
};

exports.getShoubyoumeiMaster = function(conn, shoubyoumeicode, at, cb){
	exports.findShoubyoumeiMaster(conn, shoubyoumeicode, at, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result === null ){
			cb("cannot find row (getShoubyoumeiMaster)");
			return;
		}
		cb(undefined, result);
	});
};

exports.searchShoubyoumeiMaster = function(conn, text, at, cb){
    var sql = "select * from shoubyoumei_master_arch " +
            " where name like ? and valid_from <= date(?) " +
            " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) order by name";
    var args = ["%" + text + "%", at, at];
    conn.query(sql, args, cb);
};

exports.getShoubyoumeiMasterByName = function(conn, name, at, cb){
    var sql = "select * from shoubyoumei_master_arch " + 
        " where name = ? and valid_from <= date(?) " +
        " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) ";
    var args = [name, at, at];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.length === 1 ){
    		cb(undefined, result[0]);
    		return;
    	}
    	cb("getShoubyoumeiMasterByName failed");
    })
};


