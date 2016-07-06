"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

var initDb = util.createClearTableFun(["disease", "disease_adj", "shoubyoumei_master_arch",
	"shuushokugo_master"]);

describe("Testing listCurrentFullDiseases", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("empty", function(done){
		db.listCurrentFullDiseases(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		});
	});

	it("without adj", function(done){
		var patientId = 3249;
		var byoumeiMasters = util.iterMap(4, function(i){
			return m.shoubyoumeiMaster({
				valid_from: valid_from,
				valid_upto: valid_upto
			});
		});
		var diseases = byoumeiMasters.map(function(master){
			return m.disease({
				patient_id: patientId,
				start_date: util.sqlDatePart(at),
				end_date: "0000-00-00",
				end_reason: util.DiseaseEndReasonNotEnded
			}).setMaster(master);
		});
		conti.exec([
			function(done){
				m.batchSave(conn, byoumeiMasters, done);
			},
			function(done){
				m.batchSave(conn, diseases, done);
			},
			function(done){
				db.listCurrentFullDiseases(conn, patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = diseases.map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("with adj", function(done){
		var patientId = 3250;
		var diseases = util.iterMap(4, function(){
			var disease = m.disease({
				patient_id: patientId,
				start_date: util.sqlDatePart(at),
				end_date: "0000-00-00",
				end_reason: util.DiseaseEndReasonNotEnded
			});
			var master = m.shoubyoumeiMaster({
				valid_from: valid_from,
				valid_upto: valid_upto
			});
			disease.setMaster(master);
			util.iterMap(2, function(){
				var adjMaster = m.shuushokugoMaster();
				var adj = m.diseaseAdj().setMaster(adjMaster);
				disease.addAdj(adj);
			});
			return disease;
		});
		conti.exec([
			function(done){
				m.batchSave(conn, diseases, done);
			},
			function(done){
				db.listCurrentFullDiseases(conn, patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = diseases.map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

})
