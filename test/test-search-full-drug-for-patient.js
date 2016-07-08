"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var model = require("./model");

var initDb = util.createClearTableFun(["visit_drug", "visit", "iyakuhin_master_arch"]);

describe("Testing new test", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

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
	})

})
