"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("conti");
var m = require("./model");

var initDb = util.createClearTableFun(["shuushokugo_master"]);

describe("Testing search shuushokugo master", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("none", function(done){
		db.searchShuushokugoMaster(conn, "テスト", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		});
	});

	function addMasters(names, done){
		conti.forEach(names, function(name, done){
			var master = m.shuushokugoMaster({
				name: name
			});
			master.save(conn, done);
		}, done);
	}

	it("case 1", function(done){
		conti.exec([
			function(done){
				addMasters(["あいう", "おいえ"], done);
			},
			function(done){
				db.searchShuushokugoMaster(conn, "おいえ", function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(util.pluck(result, "name")).eql(["おいえ"]);
					done();
				})
			}
		], done);
	});

	it("case 2", function(done){
		conti.exec([
			function(done){
				addMasters(["おいえ", "あいう"], done);
			},
			function(done){
				db.searchShuushokugoMaster(conn, "い", function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(util.pluck(result, "name")).eql(["あいう", "おいえ"]);
					done();
				})
			}
		], done);
	});

	it("case 3", function(done){
		conti.exec([
			function(done){
				addMasters(["おいえ", "あいう"], done);
			},
			function(done){
				db.searchShuushokugoMaster(conn, "か", function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(util.pluck(result, "name")).eql([]);
					done();
				})
			}
		], done);
	});

});

describe("Testing get shuushokugo by name", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("fail", function(done){
		db.getShuushokugoMasterByName(conn, "あいう", function(err){
			expect(err).ok;
			done();
		})
	});

	function addMasters(names, done){
		conti.forEach(names, function(name, done){
			var master = m.shuushokugoMaster({
				name: name
			});
			master.save(conn, done);
		}, done);
	}

	it("case 1", function(done){
		conti.exec([
			function(done){
				addMasters(["あいう", "かきく", "さしす"], done);
			},
			function(done){
				db.getShuushokugoMasterByName(conn, "かきく", function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.name).eql("かきく");
					done();
				})
			}
		], done);
	});

});

