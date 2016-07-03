"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var uConst = require("./util-const");
var conti = require("../lib/conti");
var m = require("./model");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["wqueue", "pharma_queue", "visit_charge"],
			["visit_drug"],
			done);
	}, done);
}

describe("Testing new test", function(){
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

	it("mock", function(done){
		var visitId = 2132;
		var chargeValue = 120;
		var wq = m.wqueue({visit_id: visitId, wait_state: uConst.wqueueStateInExam});
		conti.exec([
			function(done){
				wq.save(conn, done);
			},
			function(done){
				db.endExam(conn, visitId, chargeValue, done);
			}
		], done);
	});

})
