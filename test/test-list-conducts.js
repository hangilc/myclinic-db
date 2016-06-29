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
			["visit_conduct"],
			done);
	}, done);
}

describe("Testing list conducts", function(){
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
		db.listConductsForVisit(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var visitId = 1000;
		var conducts = util.range(0, 3).map(function(){
			return m.conduct({visit_id: visitId});
		});
		m.batchSave(conn, conducts, function(err){
			db.listConductsForVisit(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				var ans = util.pluck(conducts, "data");
				expect(result).eql(ans);
				done();
			})
		});
	})
})
