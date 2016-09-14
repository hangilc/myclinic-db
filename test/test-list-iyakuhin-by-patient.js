"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var util = require("./util");
var conti = require("conti");

describe("Testing listIyakuhinByPatient", function(){
	var conn = setup.getConnection();

	beforeEach(function(done){
		util.clearTables(conn, ["visit", "visit_drug", "iyakuhin_master_arch"], done);
	});

	it("simple", function(done){
		db.listIyakuhinByPatient(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			done();
		})
	});

	it("simple", function(done){
		var masters = [
			util.mockIyakuhinMaster({ iyakuhincode: 1234, name: "アムロジピン錠", yomi: "ｱﾑﾛｼﾞﾋﾟﾝ" }),
			util.mockIyakuhinMaster({ iyakuhincode: 3321, name: "パブロン錠", yomi: "ﾊﾟﾌﾞﾛﾝ" }),
		];
		var patientId = 3321;
		var visits = [{}, {}];
		var list;
		conti.exec([
			function(done){
				conti.forEach(masters, function(master, done){
					db.insertIyakuhinMaster(conn, master, done);
				}, done);
			},
			function(done){
				conti.forEach(visits, function(visit, done){
					util.assign(visit, util.mockVisit({patient_id: patientId}));
					db.insertVisit(conn, visit, done);
				}, done);
			},
			function(done){
				var visitId = visits[0].visit_id;
				conti.forEach([masters[1], masters[0]], function(master, done){
					db.insertDrug(conn, util.mockDrug({
						visit_id: visitId,
						d_iyakuhincode: master.iyakuhincode
					}), done);
				}, done);
			},
			function(done){
				var visitId = visits[1].visit_id;
				conti.forEach([masters[0], masters[1]], function(master, done){
					db.insertDrug(conn, util.mockDrug({
						visit_id: visitId,
						d_iyakuhincode: master.iyakuhincode
					}), done);
				}, done);
			},
			function(done){
				db.listIyakuhinByPatient(conn, patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					list = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = [masters[0], masters[1]].map(function(m){
				return {
					iyakuhincode: m.iyakuhincode,
					name: m.name,
					yomi: m.yomi
				}
			});
			expect(list).eql(ans);
			done();
		})
	})
});