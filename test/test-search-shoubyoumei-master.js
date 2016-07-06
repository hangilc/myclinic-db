"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

var initDb = util.createClearTableFun(["shoubyoumei_master_arch"]);

describe("Testing shoubyoumei master", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("none", function(done){
		db.searchShoubyoumeiMaster(conn, "テスト", at, function(err, result){
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
			var master = m.shoubyoumeiMaster({
				valid_from: valid_from,
				valid_upto: valid_upto,
				name: name
			});
			master.save(conn, done);
		}, done);
	}

	it("case 1", function(done){
		conti.exec([
			function(done){
				addMasters(["編症似", "亜症像"], done);
			},
			function(done){
				db.searchShoubyoumeiMaster(conn, "編症似", at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(util.pluck(result, "name")).eql(["編症似"]);
					done();
				})
			}
		], done);
	});

	it("case 2", function(done){
		conti.exec([
			function(done){
				addMasters(["編症似", "亜症像"], done);
			},
			function(done){
				db.searchShoubyoumeiMaster(conn, "症", at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(util.pluck(result, "name")).eql(["亜症像", "編症似"]);
					done();
				})
			}
		], done);
	});

	it("case 3", function(done){
		conti.exec([
			function(done){
				addMasters(["編症似", "亜症像"], done);
			},
			function(done){
				db.searchShoubyoumeiMaster(conn, "痛", at, function(err, result){
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

	it("case 4", function(done){
		var master1 = m.shoubyoumeiMaster({
			name: "編症似",
			valid_from: util.incDay(at, -100),
			valid_upto: util.incDay(at, -10)
		});
		var master2 = m.shoubyoumeiMaster({
			name: "亜症像",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		conti.exec([
			function(done){
				m.batchSave(conn, [master1, master2], done);
			},
			function(done){
				db.searchShoubyoumeiMaster(conn, "症", at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(util.pluck(result, "name")).eql(["亜症像"]);
					done();
				})
			}
		], done);
	});

});

describe("Testing get shoubyoumei by name", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("fail", function(done){
		db.getShoubyoumeiMasterByName(conn, "あいう", at, function(err){
			expect(err).ok;
			done();
		})
	});

	function addMasters(names, done){
		conti.forEach(names, function(name, done){
			var master = m.shoubyoumeiMaster({
				valid_from: valid_from,
				valid_upto: valid_upto,
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
				db.getShoubyoumeiMasterByName(conn, "かきく", at, function(err, result){
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

	it("case 2", function(done){
		var master1 = m.shoubyoumeiMaster({
			name: "あいう",
			valid_from: util.incDay(at, -100),
			valid_upto: util.incDay(at, -10)
		});
		var master2 = m.shoubyoumeiMaster({
			name: "あいう",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		conti.exec([
			function(done){
				m.batchSave(conn, [master1, master2], done);
			},
			function(done){
				db.getShoubyoumeiMasterByName(conn, "あいう", at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.name).eql("あいう");
					done();
				})
			}
		], done);
	});

});
