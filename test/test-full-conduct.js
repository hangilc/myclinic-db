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
					gazou_label: "",
					drugs: [],
					shinryou_list: [],
					kizai_list: []
				})
				expect(result).eql(ans);
				done();
			})
		})
	});

	it("simple", function(done){
		var conduct = m.conduct();
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var i, drug, iMaster, shinryou, sMaster, kizai, kMaster;
		conduct.setGazouLabel(m.gazouLabel({label: "胸部単純"}));
		for(i=0;i<3;i++){
			iMaster = m.iyakuhinMaster({valid_from: valid_from, valid_upto: valid_upto});
			drug = m.conductDrug().setMaster(iMaster);
			conduct.addDrug(drug);
		}
		for(i=0;i<3;i++){
			sMaster = m.shinryouMaster({valid_from: valid_from, valid_upto: valid_upto});
			shinryou = m.conductShinryou().setMaster(sMaster);
			conduct.addShinryou(shinryou);
		}
		for(i=0;i<3;i++){
			kMaster = m.kizaiMaster({valid_from: valid_from, valid_upto: valid_upto});
			kizai = m.conductKizai().setMaster(kMaster);
			conduct.addKizai(kizai);
		}
		conduct.save(conn, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getFullConduct(conn, conduct.data.id, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(conduct.getFullData());
				done();
			})
		})
	})
})