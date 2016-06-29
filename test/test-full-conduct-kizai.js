"use strict";

var util = require("./util");
var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var conti = require("../lib/conti");
var m = require("./model");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["tokuteikizai_master_arch"], 
			["visit_conduct_kizai", "visit_conduct"], 
			done);
	}, done);
}

describe("Testing full conduct kizai", function(){
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
		db.listFullKizaiForConduct(conn, 0, "2016-06-28 15:27:52", function(err, result){
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
		var master = m.kizaiMaster({valid_from: valid_from, valid_upto: valid_upto});
		var kizai = m.conductKizai({visit_conduct_id: conductId}).setMaster(master);
		conti.exec([
			function(done){ kizai.save(conn, done); }
		], function(err){
			if( err ){
				done(err);
				return;
			}
			db.listFullKizaiForConduct(conn, conductId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql([kizai.getFullData()]);
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
			master = m.kizaiMaster({valid_from: valid_from, valid_upto: valid_upto});
			shinryou = m.conductKizai().setMaster(master);
			conduct.addKizai(kizai);
		}
		conduct.save(conn, function(err){
			if( err ){
				done(err);
				return;
			}
			db.listFullKizaiForConduct(conn, conduct.id, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				done();
			})
		})
	})
})
