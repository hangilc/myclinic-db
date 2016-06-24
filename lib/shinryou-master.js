"use strict";

exports.insertShinryouMaster = function(conn, master, cb){
	var sql = "insert into shinryoukoui_master_arch set shinryoucode = ?, " +
		" name = ?, tensuu = ?, tensuu_shikibetsu = ?, shuukeisaki = ?, " +
		" houkatsukensa = ?, oushinkubun = ?, kensagroup = ?, roujintekiyou = ?, " +
		" code_shou = ?, code_bu = ?, code_alpha = ?, code_kubun = ?, " +
		" valid_from = ?, valid_upto = ?";
    var args = [
    	master.shinryoucode, master.name, master.tensuu, master.tensuu_shikibetsu,
    	master.shuukeisaki, master.houkatsukensa, master.oushinkubun,
    	master.kensagroup, master.roujintekiyou, master.code_shou,
    	master.code_bu, master.code_alpha, master.code_kubun,
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

exports.getShinryouMaster = function(conn, shinryoucode, at, cb){
	var sql = "select * from shinryoukoui_master_arch " +
		" where shinryoucode = ? and valid_from <= date(?) " +
		" and (valid_upto = '0000-00-00' or valid_upto >= date(?))";
	var args = [shinryoucode, at, at];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getShinryouMaster failed");
	})
};

exports.findShinryouMaster = function(conn, shinryoucode, at, cb){
	var sql = "select * from shinryoukoui_master_arch " +
		" where shinryoucode = ? and valid_from <= date(?) " +
		" and (valid_upto = '0000-00-00' or valid_upto >= date(?))";
	var args = [shinryoucode, at, at];
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
		cb("getShinryouMaster failed");
	})
};
