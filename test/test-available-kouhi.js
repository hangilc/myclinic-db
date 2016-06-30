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
			["kouhi"],
			done);
	}, done);
}

function mkHoken(patientId, validFrom, validUpto){
	return m.kouhi({patient_id: patientId, valid_from: validFrom, valid_upto: validUpto});
}

describe("Testing available kouhi", function(){
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
		db.listAvailableShahokokuho(conn, 1, at, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var patientId = 2000;
		var shaho = mkHoken(patientId, valid_from, valid_upto);
		shaho.save(conn, function(err){
			db.listAvailableKouhi(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql([shaho.data]);
				done();
			})
		})
	});

	it("with out of date", function(done){
		var patientId = 2000;
		var prev = mkHoken(patientId, "2016-01-01", "2016-03-31");
		var curr = mkHoken(patientId, "2016-04-01", "2017-03-31");
		m.batchSave(conn, [prev, curr], function(err){
			db.listAvailableKouhi(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql([curr.data]);
				done();
			})
		});
	})

	it("multiple", function(done){
		var patientId = 2000;
		var prev = mkHoken(patientId, "2016-01-01", "2016-03-31");
		var curr = mkHoken(patientId, "2016-04-01", "2017-03-31");
		var curr2 = mkHoken(patientId, "2016-04-01", "0000-00-00");
		m.batchSave(conn, [prev, curr, curr2], function(err){
			db.listAvailableKouhi(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql([curr.data, curr2.data]);
				done();
			})
		});
	})
})
