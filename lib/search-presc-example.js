"use strict";

var util = require("./util");

exports.searchPrescExample = function(conn, text, cb){
    var sql = "select p.*, m.* from presc_example p, iyakuhin_master_arch m " +
        " where p.m_iyakuhincode = m.iyakuhincode and p.m_master_valid_from = m.valid_from " +
        " and m.name like ? order by p.presc_example_id";
    var args = ["%" + text + "%"];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		done(err);
    		return;
    	}
    	result.forEach(function(r){
    		util.deleteUnusedIyakuhinMasterColumn(r);
    		util.deleteUnusedPrescExampleColumn(r);
    	});
    	cb(undefined, result);
    });
};