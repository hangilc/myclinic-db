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
			["wqueue", "pharma_queue"],
			["visit_conduct", "visit_drug", "visit_shinryou", "visit_text", "visit"],
			done);
	}, done);
}

describe("Testing safely delete visit", function(){
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

	it("empty", function(done){
		var visit = m.visit();
		var visitId;
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				visitId = visit.data.visit_id;
				db.safelyDeleteVisit(conn, visitId, done);
			}
		], done);
	});

	it("confirm pharma queue is also deleted", function(done){
		var visit = m.visit();
		var visitId;
		var pq;
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				visitId = visit.data.visit_id;
				pq = m.pharmaQueue({visit_id: visitId});
				pq.save(conn, done);
			},
			function(done){
				db.safelyDeleteVisit(conn, visitId, done);
			},
			function(done){
				db.findPharmaQueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).null;
					done();
				})
			}
		], done);
	})

})
