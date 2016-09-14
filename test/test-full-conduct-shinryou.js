"use strict";

var util = require("./util");
var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var conti = require("conti");
var m = require("./model");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["shinryoukoui_master_arch"], 
			["visit_conduct_shinryou", "visit_conduct"], 
			done);
	}, done);
}

describe("Testing full conduct shinryou", function(){
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
		db.listFullShinryouForConduct(conn, 0, "2016-06-28 15:27:52", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var conductId = 1000;
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var master = m.shinryouMaster({valid_from: valid_from, valid_upto: valid_upto});
		var shinryou = m.conductShinryou({visit_conduct_id: conductId}).setMaster(master);
		conti.exec([
			function(done){ shinryou.save(conn, done); }
		], function(err){
			if( err ){
				done(err);
				return;
			}
			db.listFullShinryouForConduct(conn, conductId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql([shinryou.getFullData()]);
				done();
			})
		});
	});

	it("multiple", function(done){
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var conduct = m.conduct();
		var i, master, shinryou;
		for(i=0;i<3;i++){
			master = m.shinryouMaster({valid_from: valid_from, valid_upto: valid_upto});
			shinryou = m.conductShinryou().setMaster(master);
			conduct.addShinryou(shinryou);
		}
		conduct.save(conn, function(err){
			if( err ){
				done(err);
				return;
			}
			db.listFullShinryouForConduct(conn, conduct.data.id, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(conduct.listFullShinryou());
				done();
			})
		})
	})
});