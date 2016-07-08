"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var model = require("./model");

var initDb = util.createClearTableFun(["visit_drug", "visit", "iyakuhin_master_arch"]);

describe("Testing search previous drug", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	//afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("emtpy", function(done){
		db.searchFullDrugForPatient(conn, 0, "テスト", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("case 1", function(done){
		var patientId = 8372;
		var visit = model.visit({
			v_datetime: at,
			patient_id: patientId
		});
		var master = model.iyakuhinMaster({
			name: "あいう",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var drug = model.drug().setMaster(master);
		visit.addDrug(drug);
		conti.exec([
			function(done){
				model.batchSave(conn, [visit], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "う", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug.getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("case 2", function(done){
		var patientId = 3234;
		var masters = {
			"カロナール": model.iyakuhinMaster({
				name: "カロナール",
				valid_from: valid_from,
				valid_upto: valid_upto
			})
		}
		var at1 = "2016-04-21";
		var visit1 = model.visit({patient_id: patientId, v_datetime: at1});
		var drugs1 = {
			"カロナール": function(){
				return model.drug({
					d_category: util.DrugCategoryNaifuku,
					d_amount: "3",
					d_usage: "分３　毎食後",
					d_days: 5
				}).setMaster(masters["カロナール"])
			}()
		}
		Object.keys(drugs1).forEach(function(key){
			visit1.addDrug(drugs1[key]);
		})
		var at2 = "2016-05-20";
		var visit2 = model.visit({patient_id: patientId, v_datetime: at2});
		var drugs2 = {
			"カロナール": function(){
				return model.drug({
					d_category: util.DrugCategoryNaifuku,
					d_amount: "3",
					d_usage: "分３　毎食後",
					d_days: 5
				}).setMaster(masters["カロナール"])
			}()
		}
		Object.keys(drugs2).forEach(function(key){
			visit2.addDrug(drugs2[key]);
		})
		conti.exec([
			function(done){
				model.batchSave(conn, [visit1, visit2], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "カロナ", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drugs2["カロナール"].getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	})

	it("case 3 (change in amount)", function(done){
		var patientId = 3234;
		var masters = {
			"カロナール": model.iyakuhinMaster({
				name: "カロナール",
				valid_from: valid_from,
				valid_upto: valid_upto
			})
		}
		var at1 = "2016-05-21";
		var visit1 = model.visit({patient_id: patientId, v_datetime: at1});
		var drugs1 = {
			"カロナール": function(){
				return model.drug({
					d_category: util.DrugCategoryNaifuku,
					d_amount: "3",
					d_usage: "分３　毎食後",
					d_days: 5
				}).setMaster(masters["カロナール"])
			}()
		}
		Object.keys(drugs1).forEach(function(key){
			visit1.addDrug(drugs1[key]);
		})
		var at2 = "2016-06-20";
		var visit2 = model.visit({patient_id: patientId, v_datetime: at2});
		var drugs2 = {
			"カロナール": function(){
				return model.drug({
					d_category: util.DrugCategoryNaifuku,
					d_amount: "2",
					d_usage: "分３　毎食後",
					d_days: 5
				}).setMaster(masters["カロナール"])
			}()
		}
		Object.keys(drugs2).forEach(function(key){
			visit2.addDrug(drugs2[key]);
		})
		conti.exec([
			function(done){
				model.batchSave(conn, [visit1, visit2], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "カロナ", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drugs2["カロナール"].getFullData(), drugs1["カロナール"].getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	})

})
