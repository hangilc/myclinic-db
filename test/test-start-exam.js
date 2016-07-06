"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["wqueue"],
			["visit"],
			done);
	}, done);
}

describe("Testing startExam", function(){
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

	it("minimal", function(done){
		var visitId = 1000;
		var wq = m.wqueue({visit_id: visitId, wait_state: util.WqueueStateWaitExam});
		conti.exec([
			function(done){
				m.batchSave(conn, [wq], function(err){
					if( err ){
						done(err);
						return;
					}
					done();
				})
			},
			function(done){
				db.startExam(conn, visitId, done);
			},
			function(done){
				db.getWqueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = {
						visit_id: visitId,
						wait_state: util.WqueueStateInExam
					}
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("with startVisit", function(done){
		var patientId = 1200;
		var visitId;
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
				db.startExam(conn, visitId, done);
			},
			function(done){
				db.getWqueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = {
						visit_id: visitId,
						wait_state: util.WqueueStateInExam
					}
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

});

describe("Testing suspendExam", function(done){
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

	it("minimal", function(done){
		var visitId = 1000;
		var wq = m.wqueue({visit_id: visitId, wait_state: util.WqueueStateInExam});
		conti.exec([
			function(done){
				wq.save(conn, done);
			},
			function(done){
				db.suspendExam(conn, visitId, done);
			},
			function(done){
				db.getWqueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = {
						visit_id: visitId,
						wait_state: util.WqueueStateWaitReExam
					}
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("with startVisit/startExam", function(done){
		var patientId = 1200;
		var visitId;
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
				db.startExam(conn, visitId, done);
			},
			function(done){
				db.suspendExam(conn, visitId, done);
			},
			function(done){
				db.getWqueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = {
						visit_id: visitId,
						wait_state: util.WqueueStateWaitReExam
					}
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});
});
