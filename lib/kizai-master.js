"use strict";

exports.insertKizaiMaster = function(conn, master, cb){
	var sql = "insert into tokuteikizai_master_arch set kizaicode = ?, " +
		" name = ?, yomi = ?, unit = ?, kingaku = ?, " +
		" valid_from = ?, valid_upto = ?";
    var args = [
    	master.kizaicode, master.name, master.yomi, master.unit, master.kingaku,
    	master.valid_from, master.valid_upto
    ];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	cb();
    });
};

exports.getKizaiMaster = function(conn, kizaicode, at, cb){
	var sql = "select * from tokuteikizai_master_arch " +
		" where kizaicode = ? and valid_from <= date(?) " +
		" and (valid_upto = '0000-00-00' or valid_upto >= date(?))";
	var args = [kizaicode, at, at];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getKizaiMaster failed");
	})
};

exports.findKizaiMaster = function(conn, kizaicode, at, cb){
	var sql = "select * from tokuteikizai_master_arch " +
		" where kizaicode = ? and valid_from <= date(?) " +
		" and (valid_upto = '0000-00-00' or valid_upto >= date(?))";
	var args = [kizaicode, at, at];
	conn.query(sql, args, function(err, result){
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
		cb("getKizaiMaster failed");
	})
};

exports.searchKizaiMaster = function(conn, text, at, cb){
	var sql = "select * from tokuteikizai_master_arch m " +
        " where name like ? and valid_from <= date(?) " +
        " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) " + 
        " order by yomi";
    var args = ["%" + text + "%", at, at];
    conn.query(sql, args, cb);
};
