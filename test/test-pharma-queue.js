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
			["pharma_queue"],
			[],
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
		var q = {visit_id: 2113, pharma_state: uConst.pharmaQueueStateWaitPack};
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
		var q = {visit_id: 2113, pharma_state: uConst.pharmaQueueStateWaitPack};
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
		var q = m.pharmaQueue({visit_id: 2114, pharma_state: uConst.pharmaQueueStateWaitPack});
		var qq = util.assign({}, q.data, {pharma_state: uConst.pharmaQueueStateInPack});
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
