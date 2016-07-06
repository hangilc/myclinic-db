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

function listAllDiseasesWithMaster(conn, patientId, cb){
    var sql = "select d.*, m.* from disease d, shoubyoumei_master_arch m " + 
        " where d.patient_id = ? " + 
        " and d.shoubyoumeicode = m.shoubyoumeicode " +
        " and m.valid_from <= d.start_date " +
        " and (m.valid_upto = '0000-00-00' or m.valid_upto >= d.start_date) " +
        " order by disease_id";
 	var args = [patientId];
 	conn.query(sql, args, cb);
};

function extendDiseaseWithAdj(conn, disease, done){
    var sql = "select a.*, m.* from disease_adj a, shuushokugo_master m " + 
        " where a.disease_id = ? and a.shuushokugocode = m.shuushokugocode " + 
        " order by disease_adj_id";
    var args = [disease.disease_id];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		done(err);
    		return;
    	}
    	disease.adj_list = result;
    	done();
    })
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

exports.listAllFullDiseases = function(conn, patientId, cb){
	var list;
    conti.exec([
    	function(done){
    		listAllDiseasesWithMaster(conn, patientId, function(err, result){
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



