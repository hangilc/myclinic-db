"use strict";

exports.insertKoukikourei = function(conn, koukikourei, cb){
    var sql = "insert into hoken_koukikourei set patient_id = ?, hokensha_bangou = ?, " +
        " hihokensha_bangou = ?, futan_wari = ?, " +
        " valid_from = ?, valid_upto = ?";
    var args = [
        koukikourei.patient_id, koukikourei.hokensha_bangou,
        koukikourei.hihokensha_bangou, 
        koukikourei.futan_wari,
        koukikourei.valid_from, koukikourei.valid_upto
    ];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var koukikoureiId = result.insertId;
    	koukikourei.koukikourei_id = koukikoureiId;
    	cb(undefined, koukikoureiId);
    });
};

exports.getKoukikourei = function(conn, koukikoureiId, cb){
	var sql = "select * from hoken_koukikourei where koukikourei_id = ?";
	conn.query(sql, [koukikoureiId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getKoukikourei failed");
	})
};

exports.findKoukikourei = function(conn, koukikoureiId, cb){
	var sql = "select * from hoken_koukikourei where koukikourei_id = ?";
	conn.query(sql, [koukikoureiId], function(err, result){
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
		cb("findKoukikourei failed");
	})
};

exports.updateKoukikourei = function(conn, koukikourei, cb){
   var sql = "update hoken_koukikourei set patient_id = ?, hokensha_bangou = ?, " +
        " hihokensha_bangou = ?, futan_wari = ?, " +
        " valid_from = ?, valid_upto = ? where koukikourei_id = ?";
    var args = [
        koukikourei.patient_id, koukikourei.hokensha_bangou,
        koukikourei.hihokensha_bangou, 
        koukikourei.futan_wari,
        koukikourei.valid_from, koukikourei.valid_upto, koukikourei.koukikourei_id
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
    	cb("updateKoukikourei failed");
    });
};

exports.deleteKoukikourei = function(conn, koukikoureiId, cb){
	var sql = "delete from hoken_koukikourei where koukikourei_id = ?";
	conn.query(sql, [koukikoureiId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteKoukikourei failed");
	})
};

exports.listAvailableKoukikourei = function(conn, patientId, at, cb){
    var sql = "select * from hoken_koukikourei where patient_id = ? " +
        " and valid_from <= date(?) " +
        " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) " +
        " order by koukikourei_id ";
    var args = [patientId, at, at];
    conn.query(sql, args, cb);
}