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
			[],
			["visit"],
			done);
	}, done);
}

function simpleTest(conn, total, offset, n, done){
	var at = "2016-06-26 21:35:21";
	var patientId = 1234;
	var visits = util.iterMap(total, function(i){
		return m.visit({patient_id: patientId, v_datetime: at});
	});
	m.batchSave(conn, visits, function(err){
		if( err ){
			done(err);
			return;
		}
		var ans = util.pluck(visits.reverse().slice(offset, offset+n), "data");
		db.listVisitsForPatient(conn, patientId, offset, n, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql(ans);
			done();
		})
	})
}

describe("Testing list visits", function(){
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

	it("empty", function(done){
		db.listVisitsForPatient(conn, 1000, 0, 10, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		});
	});

	it("simple 24, 0, 10", function(done){
		simpleTest(conn, 24, 0, 10, done);
	});

	it("simple 24, 10, 10", function(done){
		simpleTest(conn, 24, 10, 10, done);
	})

	it("simple 24, 20, 10", function(done){
		simpleTest(conn, 24, 10, 10, done);
	})
	it("simple 24, 30, 10", function(done){
		simpleTest(conn, 24, 10, 10, done);
	})
})
