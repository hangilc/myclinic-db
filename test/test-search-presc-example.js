"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("conti");
var model = require("./model");

var initDb = util.createClearTableFun(["presc_example", "iyakuhin_master_arch"]);

describe("Testing search presc example", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var old_valid_from = "2014-04-01";
	var old_valid_upto = "2016-03-31";
	var valid_from = "2016-04-01";
	var at = "2016-06-26";
	var valid_upto = "2018-03-31";
	var future_valid_from = "2018-04-01";
	var future_valid_upto = "2020-03-31";

	it("empty", function(done){
		db.searchPrescExample(conn, "テスト", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	function makePrescExample(name, valid_from, valid_upto){
		var master = model.iyakuhinMaster({
			name: name,
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		return model.prescExample({
			m_master_valid_from: valid_from
		}).setMaster(master);
	}

	it("case 1", function(done){
		var ex = makePrescExample("あいう", valid_from, valid_upto);
		conti.exec([
			function(done){
				ex.save(conn, done);
			},
			function(done){
				db.searchPrescExample(conn, "い", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [ex.getFullData()];
					expect(result).eql(ans);
					done();
				});
			}
		], done);
	});

	it("case 2", function(done){
		var ex = makePrescExample("あいう", old_valid_from, old_valid_upto);
		conti.exec([
			function(done){
				ex.save(conn, done);
			},
			function(done){
				db.searchPrescExample(conn, "い", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [ex.getFullData()];
					expect(result).eql(ans);
					done();
				});
			}
		], done);
	});

	it("case 3", function(done){
		var ex = makePrescExample("あいう", future_valid_from, future_valid_upto);
		conti.exec([
			function(done){
				ex.save(conn, done);
			},
			function(done){
				db.searchPrescExample(conn, "い", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [ex.getFullData()];
					expect(result).eql(ans);
					done();
				});
			}
		], done);
	});

	it("case 4", function(done){
		var exlist = [
			makePrescExample("あいう", valid_from, valid_upto),
			makePrescExample("かきく", old_valid_from, old_valid_upto),
			makePrescExample("さいす", future_valid_from, future_valid_upto),
			makePrescExample("たちつ", valid_from, valid_upto),
		];
		conti.exec([
			function(done){
				model.batchSave(conn, exlist, done);
			},
			function(done){
				db.searchPrescExample(conn, "い", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [0, 2].map(function(i){ return exlist[i].getFullData(); });
					expect(result).eql(ans);
					done();
				});
			}
		], done);
	})

});
