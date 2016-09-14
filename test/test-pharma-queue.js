"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("conti");
var m = require("./model");
var moment = require("moment");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["pharma_queue"],
			[],
			done);
	}, done);
}

describe("Testing pharma queue", function(){
	var conn;

	beforeEach(initDb);

	beforeEach(function(done){
		setup.connect(function(err, conn_){
			if( err ){
				done(err);
				return;
			}
			conn = conn_;
			done();
		})
	});

	afterEach(function(done){
		setup.release(conn, done);
	});

	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("insert", function(done){
		var visitId = 4213;
		var state = 0;
		db.insertPharmaQueue(conn, {visit_id: visitId, pharma_state: state}, done);
	});

	it("find (none)", function(done){
		db.findPharmaQueue(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).not.ok;
			done();
		})
	});

	it("find (one)", function(done){
		var q = {visit_id: 2113, pharma_state: util.PharmaQueueStateWaitPack};
		conti.exec([
			function(done){
				db.insertPharmaQueue(conn, q, done);
			},
			function(done){
				db.findPharmaQueue(conn, q.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(q);
					done();
				})
			}
		], done);
	});

	it("get (none)", function(done){
		db.getPharmaQueue(conn, 0, function(err, result){
			expect(err).ok;
			done();
		})
	});

	it("get (one)", function(done){
		var q = {visit_id: 2113, pharma_state: util.PharmaQueueStateWaitPack};
		conti.exec([
			function(done){
				db.insertPharmaQueue(conn, q, done);
			},
			function(done){
				db.getPharmaQueue(conn, q.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(q);
					done();
				})
			}
		], done);
	});

	it("update", function(done){
		var q = m.pharmaQueue({visit_id: 2114, pharma_state: util.PharmaQueueStateWaitPack});
		var qq = util.assign({}, q.data, {pharma_state: util.PharmaQueueStateInPack});
		conti.exec([
			function(done){
				q.save(conn, done);
			},
			function(done){
				db.updatePharmaQueue(conn, qq, done);
			},
			function(done){
				db.getPharmaQueue(conn, q.data.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(qq);
					done();
				})
			}
		], done);
	});

	it("delete (none)", function(done){
		db.deletePharmaQueue(conn, 0, function(err){
			expect(err).ok;
			done();
		})
	});

	it("delete (one)", function(done){
		var visitId = 3914;
		var q = m.pharmaQueue({visit_id: visitId});
		conti.exec([
			function(done){
				q.save(conn, done);
			},
			function(done){
				db.deletePharmaQueue(conn, visitId, done);
			},
			function(done){
				db.findPharmaQueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).not.ok;
					done();
				});
			}
		], done);
	});
});

describe("Testing listFullPharmaQueue", function(){
	var conn;

	beforeEach(function(){
		conn = setup.getConnection();
	});

	beforeEach(function(done){
		util.clearTables(conn, ["pharma_queue", "visit", "patient", "wqueue"], done);
	})

	it("empty", function(done){
		db.listFullPharmaQueue(conn, function(err, result){
			expect(err).null;
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var patient1 = util.mockPatient();
		var patient2 = util.mockPatient();
		var visit1 = util.mockVisit();
		var visit2 = util.mockVisit();
		var wq2 = util.mockWqueue();
		var pqueue1 = util.mockPharmaQueue();
		var pqueue2 = util.mockPharmaQueue();
		var pqList;
		conti.exec([
			function(done){
				conti.forEach([patient1, patient2], function(patient, done){
					db.insertPatient(conn, patient, done);
				}, done);
			},
			function(done){
				visit1.patient_id = patient1.patient_id;
				visit2.patient_id = patient2.patient_id;
				conti.forEach([visit1, visit2], function(visit, done){
					db.insertVisit(conn, visit, done);
				}, done);
			},
			function(done){
				wq2.visit_id = visit2.visit_id;
				wq2.wait_state = util.WqueueStateWaitDrug;
				conti.forEach([wq2], function(wq, done){
					db.insertWqueue(conn, wq, done);
				}, done);
			},
			function(done){
				pqueue1.visit_id = visit1.visit_id;
				pqueue1.pharma_state = util.PharmaQueueStatePackDone;
				pqueue2.visit_id = visit2.visit_id;
				pqueue2.pharma_state = util.PharmaQueueStateWaitPack;
				conti.forEach([pqueue1, pqueue2], function(pqueue, done){
					db.insertPharmaQueue(conn, pqueue, done);
				}, done);
			},
			function(done){
				db.listFullPharmaQueue(conn, function(err, result){
					if( err ){
						done(err);
						return;
					}
					pqList = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = [
				util.assign(pqueue2, {
					last_name: patient2.last_name,
					first_name: patient2.first_name,
					last_name_yomi: patient2.last_name_yomi,
					first_name_yomi: patient2.first_name_yomi,
					patient_id: patient2.patient_id,
					wait_state: wq2.wait_state
				})
			]
			expect(pqList).eql(ans);
			done();
		})
	})
});

describe("Testing listTodaysVisitsForPharma", function(){
	var conn;

	beforeEach(function(){
		conn = setup.getConnection();
	});

	beforeEach(function(done){
		util.clearTables(conn, ["visit", "patient", "wqueue"], done);
	})

	it("empty", function(done){
		db.listTodaysVisitsForPharma(conn, function(err, result){
			expect(err).null;
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var patient1 = util.mockPatient();
		var patient2 = util.mockPatient();
		var atDay = util.todayAsSqlDate();
		var visit1 = util.mockVisit({
			v_datetime: atDay + " 09:12:23"
		});
		var visit2 = util.mockVisit({
			v_datetime: atDay + " 10:00:00"
		});
		var wq2 = util.mockWqueue();
		var pqList;
		conti.exec([
			function(done){
				conti.forEach([patient1, patient2], function(patient, done){
					db.insertPatient(conn, patient, done);
				}, done);
			},
			function(done){
				visit1.patient_id = patient1.patient_id;
				visit2.patient_id = patient2.patient_id;
				conti.forEach([visit1, visit2], function(visit, done){
					db.insertVisit(conn, visit, done);
				}, done);
			},
			function(done){
				wq2.visit_id = visit2.visit_id;
				wq2.wait_state = util.WqueueStateWaitDrug;
				conti.forEach([wq2], function(wq, done){
					db.insertWqueue(conn, wq, done);
				}, done);
			},
			function(done){
				db.listTodaysVisitsForPharma(conn, function(err, result){
					if( err ){
						done(err);
						return;
					}
					pqList = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = [
				{
					visit_id: visit1.visit_id,
					last_name: patient1.last_name,
					first_name: patient1.first_name,
					last_name_yomi: patient1.last_name_yomi,
					first_name_yomi: patient1.first_name_yomi,
					wait_state: null
				},
				{
					visit_id: visit2.visit_id,
					last_name: patient2.last_name,
					first_name: patient2.first_name,
					last_name_yomi: patient2.last_name_yomi,
					first_name_yomi: patient2.first_name_yomi,
					wait_state: wq2.wait_state
				}
			];
			expect(pqList).eql(ans);
			done();
		})
	})

});