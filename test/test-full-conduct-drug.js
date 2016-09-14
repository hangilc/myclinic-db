"use strict";

var util = require("./util");
var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var conti = require("conti");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["iyakuhin_master_arch"], 
			["visit_conduct_drug"], 
			done);
	}, done);
}

describe("Testing list full conduct drugs", function(){
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

	it("no result", function(done){
		db.listFullDrugsForConduct(conn, 0, "2016-06-28 15:27:52", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var du = new DbUtil(conn);
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var masters = util.range(0, 3).map(function(){
			return util.mockIyakuhinMaster({
				valid_from: valid_from,
				valid_upto: valid_upto
			});
		});
		var conduct = util.mockConduct();
		var fullDrugs;
		function makeFullDrugs(){
			return masters.map(function(master){
				return {
					drug: util.mockConductDrug({
						visit_conduct_id: conduct.id,
						iyakuhincode: master.iyakuhincode
					}),
					master: master
				};
			});
		}
		conti.exec([
			du.t_in_im(masters),
			du.t_in_c([conduct]),
			function(done){
				fullDrugs = makeFullDrugs();
				var drugs = util.pluck(fullDrugs, "drug");
				du.in_cd(drugs, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = fullDrugs.map(function(item){
				return util.assign({}, item.drug, item.master);
			});
			db.listFullDrugsForConduct(conn, conduct.id, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(ans);
				done();
			})
		});
	})
});