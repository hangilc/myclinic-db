"use strict";

var expect = require("chai").expect;
var db = require("../index");
var setup = require("./setup");
var util = require("./util");
var conti = require("../lib/conti");

function initTables(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, ["iyakuhin_master_arch"], ["visit_drug"], done);
	}, done);
}

describe("Testing full drug", function(){
	var conn;

	beforeEach(initTables);

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

	afterEach(initTables);

	it("not existing", function(done){
		db.getFullDrug(conn, 1000, "2016-06-26 21:31:26", function(err){
			expect(err).ok;
			done();
		})
	});

	it("simple (no upto)", function(done){
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var master = util.mockIyakuhinMaster({
			valid_from: valid_from,
			valid_upto: valid_upto
		})
		var drug = util.mockDrug({
			d_iyakuhincode: master.iyakuhincode
		})
		conti.exec([
			function(done){
				db.insertIyakuhinMaster(conn, master, done);
			},
			function(done){
				db.insertDrug(conn, drug, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = util.assign({}, drug);
			util.assign(ans, master);
			db.getFullDrug(conn, drug.drug_id, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				util.deleteUnusedIyakuhinMasterColumn(result);
				expect(result).eql(ans);
				done();
			})
		})
	});
})