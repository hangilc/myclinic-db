"use strict";

var util = require("./util");
var conti = require("./conti");

function listCurrentDiseasesWithMaster(conn, patientId, cb){
    var sql = "select d.*, m.* from disease d, shoubyoumei_master_arch m " + 
        " where d.patient_id = ? and d.end_reason = ? " + 
        " and d.shoubyoumeicode = m.shoubyoumeicode " +
        " and m.valid_from <= d.start_date " +
        " and (m.valid_upto = '0000-00-00' or m.valid_upto >= d.start_date) " +
        " order by disease_id";
    var args = [patientId, util.DiseaseEndReasonNotEnded];
    conn.query(sql, args, cb);
}

function extendDiseaseWithAdj(conn, disease, done){
	disease.adj_list = [];
	done();
}

exports.listCurrentFullDiseases = function(conn, patientId, cb){
	var list;
    conti.exec([
    	function(done){
    		listCurrentDiseasesWithMaster(conn, patientId, function(err, result){
    			if( err ){
    				done(err);
    				return;
    			}
    			list = result;
    			done();
    		})
    	},
    	function(done){
    		conti.forEach(list, function(disease, done){
    			extendDiseaseWithAdj(conn, disease, done);
    		}, done);
    	}
	], function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, list);
	});
};