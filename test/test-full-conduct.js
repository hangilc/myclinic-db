"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["shinryoukoui_master_arch", "iyakuhin_master_arch", "tokuteikizai_master_arch", "visit_gazou_label"],
			["visit_conduct", "visit_conduct_shinryou", "visit_conduct_drug", "visit_conduct_kizai"],
			done);
	}, done);
}

describe("Testing full conduct", function(){
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
		db.getFullConduct(conn, 0, "2016-06-28 13:28:15", function(err){
			expect(err).ok
			done();
		})
	});

	it("empty", function(done){
		var du = new DbUtil(conn);
		var conduct = util.mockConduct({
			visit_id: 1
		});
		var at = "2016-06-28 15:09:18";
		conti.exec([
			function(done){
				du.in_c([conduct], done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			db.getFullConduct(conn, conduct.id, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				var ans = util.assign({}, conduct, {
					gazou_label: null,
					drugs: [],
					shinryou_list: [],
					kizai_list: []
				})
				done();
			})
		})
	})
})