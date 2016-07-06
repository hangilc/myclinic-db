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

	function makeDiseases(patientId, at, nDiseases, nAdj){
		return util.iterMap(nDiseases, function(){
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
			util.iterMap(nAdj, function(){
				var adjMaster = m.shuushokugoMaster();
				var adj = m.diseaseAdj().setMaster(adjMaster);
				disease.addAdj(adj);
			});
			return disease;
		});
	}

	it("multiple patients", function(done){
		var patient1 = 4250;
		var patient2 = 4251;
		var dlist1 = makeDiseases(patient1, at, 4, 2);
		var dlist2 = makeDiseases(patient2, at, 3, 3);
		conti.exec([
			function(done){
				m.batchSave(conn, dlist1, done);
			},
			function(done){
				m.batchSave(conn, dlist2, done);
			},
			function(done){
				db.listCurrentFullDiseases(conn, patient1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = dlist1.map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("with cure, stop, or dead", function(done){
		var patientId = 4750;
		var dlist = makeDiseases(patientId, at, 12, 2);
		[2, 5].forEach(function(i){
			dlist[i].data.end_reason = util.DiseaseEndReasonCured;
		});
		[4, 7].forEach(function(i){
			dlist[i].data.end_reason = util.DiseaseEndReasonStopped;
		});
		[10].forEach(function(i){
			dlist[i].data.end_reason = util.DiseaseEndReasonDead;
		});
		conti.exec([
			function(done){
				m.batchSave(conn, dlist, done);
			},
			function(done){
				db.listCurrentFullDiseases(conn, patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var clist = dlist.filter(function(d){ 
						return d.data.end_reason === util.DiseaseEndReasonNotEnded;
					});
					var ans = clist.map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});
});

describe("Testing listAllFullDiseases", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("empty", function(done){
		db.listAllFullDiseases(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		});
	});

	function makeDiseases(patientId, at, nDiseases, nAdj){
		return util.iterMap(nDiseases, function(){
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
			util.iterMap(nAdj, function(){
				var adjMaster = m.shuushokugoMaster();
				var adj = m.diseaseAdj().setMaster(adjMaster);
				disease.addAdj(adj);
			});
			return disease;
		});
	}

	it("single patient", function(done){
		var patientId = 6654;
		var dlist = makeDiseases(patientId, at, 13, 1);
		[2, 5].forEach(function(i){
			dlist[i].data.end_reason = util.DiseaseEndReasonCured;
		});
		[4, 7].forEach(function(i){
			dlist[i].data.end_reason = util.DiseaseEndReasonStopped;
		});
		[10].forEach(function(i){
			dlist[i].data.end_reason = util.DiseaseEndReasonDead;
		});
		conti.exec([
			function(done){
				m.batchSave(conn, dlist, done);
			},
			function(done){
				db.listAllFullDiseases(conn, patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = dlist.map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("two patients", function(done){
		var patientId1 = 6664;
		var dlist1 = makeDiseases(patientId1, at, 13, 1);
		[2, 5].forEach(function(i){
			dlist1[i].data.end_reason = util.DiseaseEndReasonCured;
		});
		[4, 7].forEach(function(i){
			dlist1[i].data.end_reason = util.DiseaseEndReasonStopped;
		});
		[10].forEach(function(i){
			dlist1[i].data.end_reason = util.DiseaseEndReasonDead;
		});
		var patientId2 = 6665;
		var dlist2 = makeDiseases(patientId2, at, 10, 1);
		[2, 5].forEach(function(i){
			dlist2[i].data.end_reason = util.DiseaseEndReasonCured;
		});
		[4, 7].forEach(function(i){
			dlist2[i].data.end_reason = util.DiseaseEndReasonStopped;
		});
		[9].forEach(function(i){
			dlist2[i].data.end_reason = util.DiseaseEndReasonDead;
		});
		conti.exec([
			function(done){
				m.batchSave(conn, [].concat(dlist1, dlist2), done);
			},
			function(done){
				db.listAllFullDiseases(conn, patientId1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = dlist1.map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	})

});
