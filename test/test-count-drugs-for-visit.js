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
			["visit_drug"],
			done);
	}, done);
}

describe("Testing count drugs for visit", function(){
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
		db.countDrugsForVisit(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql(0);
			done();
		})
	});

	it("multiple", function(done){
		var n = 3;
		var visitId = 92013;
		var drugs = util.iterMap(n, function(i){
			var props = {
				visit_id: visitId,
				d_iyakuhincode: 1000 + i
			};
			return m.drug(props);
		});
		conti.exec([
			function(done){
				m.batchSave(conn, drugs, done);
			},
			function(done){
				db.countDrugsForVisit(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(n);
					done();
				});
			}
		], done);
	});

})
