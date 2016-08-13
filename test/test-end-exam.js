"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");
var moment = require("moment");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["wqueue", "pharma_queue", "visit_charge"],
			["visit_drug", "visit"],
			done);
	}, done);
}

describe("Testing end exam", function(){
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

	it("no drug", function(done){
		var patientId = 2132;
		var visitId;
		var chargeValue = 120;
		conti.exec([
			function(done){
				db.startVisit(conn, patientId, at, function(err, visitId_){
					if( err ){
						done(err);
						return;
					}
					visitId = visitId_;
					done();
				});
			},
			function(done){
				db.endExam(conn, visitId, chargeValue, done);
			},
			function(done){
				db.getCharge(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.charge).eql(chargeValue);
					done();
				})
			},
			function(done){
				db.getWqueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.wait_state).eql(util.WqueueStateWaitCashier);
					done();
				})
			},
			function(done){
				db.findPharmaQueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).not.ok;
					done();
				})
			}
		], done);
	});

	it("with drugs", function(done){
		var patientId = 2133;
		var visitId;
		var chargeValue = 140;
		var now = moment().format("YYYY-MM-DD HH:mm:ss")
		conti.exec([
			function(done){
				db.startVisit(conn, patientId, now, function(err, visitId_){
					if( err ){
						done(err);
						return;
					}
					visitId = visitId_;
					done();
				});
			},
			function(done){
				var drugs = util.iterMap(4, function(i){
					return m.drug({
						visit_id: visitId,
						d_iyakuhincode: 20000+i
					});
				});
				m.batchSave(conn, drugs, done);
			},
			function(done){
				db.endExam(conn, visitId, chargeValue, done);
			},
			function(done){
				db.getCharge(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.charge).eql(chargeValue);
					done();
				})
			},
			function(done){
				db.getWqueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.wait_state).eql(util.WqueueStateWaitCashier);
					done();
				})
			},
			function(done){
				db.findPharmaQueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql({visit_id: visitId, pharma_state: util.PharmaQueueStateWaitPack})
					done();
				})
			}
		], done);
	});

});

describe("Testing endExam (2)", function(){
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

	it("not today", function(done){
		var patientId = 2133;
		var visit = util.mockVisit({
			v_datetime: "2016-03-12 11:32:00"
			//v_datetime: moment().format("YYYY-MM-DD 10:23:46")
		});
		var drug1 = util.mockDrug({
			d_prescribed: 0
		});
		conti.exec([
			function(done){
				db.insertVisit(conn, visit, done);
			},
			function(done){
				drug1.visit_id = visit.visit_id;
				db.insertDrug(conn, drug1, done);
			},
			function(done){
				db.endExam(conn, visit.visit_id, 320, done);
			},
			function(done){
				db.getWqueue(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.wait_state).equal(util.WqueueStateWaitCashier);
					done();
				})
			},
			function(done){
				db.findPharmaQueue(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).null;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			done();
		})
	})

	it("today (not prescribed)", function(done){
		var patientId = 2133;
		var visit = util.mockVisit({
			v_datetime: moment().format("YYYY-MM-DD HH:mm:ss")
		});
		var drug1 = util.mockDrug({
			d_prescribed: 0
		});
		conti.exec([
			function(done){
				db.insertVisit(conn, visit, done);
			},
			function(done){
				drug1.visit_id = visit.visit_id;
				db.insertDrug(conn, drug1, done);
			},
			function(done){
				db.endExam(conn, visit.visit_id, 320, done);
			},
			function(done){
				db.getWqueue(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.wait_state).equal(util.WqueueStateWaitCashier);
					done();
				})
			},
			function(done){
				db.findPharmaQueue(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).not.null;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			done();
		})
	})	

	it("today (prescribed)", function(done){
		var patientId = 2133;
		var visit = util.mockVisit({
			v_datetime: moment().format("YYYY-MM-DD HH:mm:ss")
		});
		var drug1 = util.mockDrug({
			d_prescribed: 1
		});
		conti.exec([
			function(done){
				db.insertVisit(conn, visit, done);
			},
			function(done){
				drug1.visit_id = visit.visit_id;
				db.insertDrug(conn, drug1, done);
			},
			function(done){
				db.endExam(conn, visit.visit_id, 320, done);
			},
			function(done){
				db.getWqueue(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.wait_state).equal(util.WqueueStateWaitCashier);
					done();
				})
			},
			function(done){
				db.findPharmaQueue(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).null;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			done();
		})
	})	

});
