"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

var initDb = util.createClearTableFun(["shoubyoumei_master_arch"]);

describe("Testing new test", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("insert", function(done){
		var data = util.mockShoubyoumeiMaster();
		db.insertShoubyoumeiMaster(conn, data, done);
	});

	it("find (none)", function(done){
		db.findShoubyoumeiMaster(conn, 0, at, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).null;
			done();
		})
	});

	it("find (none 2)", function(done){
		var master = m.shoubyoumeiMaster({valid_from: valid_from, valid_upto: valid_upto});
		conti.exec([
			function(done){
				master.save(conn, done);
			},
			function(done){
				var shoubyoumeicode = master.data.shoubyoumeicode;
				var invalidUpto = util.incDay(valid_upto, 1)
				db.findShoubyoumeiMaster(conn, shoubyoumeicode, invalidUpto, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).null;
					done();
				})
			}
		], done);
	});

	it("find (one)", function(done){
		var master = m.shoubyoumeiMaster({valid_from: valid_from, valid_upto: valid_upto});
		conti.exec([
			function(done){
				master.save(conn, done);
			},
			function(done){
				var shoubyoumeicode = master.data.shoubyoumeicode;
				db.findShoubyoumeiMaster(conn, shoubyoumeicode, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).not.null;
					expect(result).eql(master.data);
					done();
				})
			}
		], done);
	});

	it("find (two)", function(done){
		var shoubyoumeicode = 1234;
		var master1 = m.shoubyoumeiMaster({
			shoubyoumeicode: shoubyoumeicode,
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var master2 = m.shoubyoumeiMaster({
			shoubyoumeicode: shoubyoumeicode,
			valid_from: util.incDay(valid_from, -1),
			valid_upto: valid_upto
		});
		conti.exec([
			function(done){
				m.batchSave(conn, [master1, master2], done);
			},
			function(done){
				db.findShoubyoumeiMaster(conn, shoubyoumeicode, at, function(err, result){
					expect(err).ok;
					done();
				})
			}
		], done);
	});

	it("get (none)", function(done){
		db.getShoubyoumeiMaster(conn, 0, at, function(err, result){
			expect(err).ok;
			done();
		})
	});

	it("get (none 2)", function(done){
		var master = m.shoubyoumeiMaster({valid_from: valid_from, valid_upto: valid_upto});
		conti.exec([
			function(done){
				master.save(conn, done);
			},
			function(done){
				var shoubyoumeicode = master.data.shoubyoumeicode;
				var invalidUpto = util.incDay(valid_upto, 1)
				db.getShoubyoumeiMaster(conn, shoubyoumeicode, invalidUpto, function(err, result){
					expect(err).ok;
					done();
				})
			}
		], done);
	});

	it("get (one)", function(done){
		var master = m.shoubyoumeiMaster({valid_from: valid_from, valid_upto: valid_upto});
		conti.exec([
			function(done){
				master.save(conn, done);
			},
			function(done){
				var shoubyoumeicode = master.data.shoubyoumeicode;
				db.getShoubyoumeiMaster(conn, shoubyoumeicode, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).not.null;
					expect(result).eql(master.data);
					done();
				})
			}
		], done);
	});

	it("get (two)", function(done){
		var shoubyoumeicode = 1234;
		var master1 = m.shoubyoumeiMaster({
			shoubyoumeicode: shoubyoumeicode,
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var master2 = m.shoubyoumeiMaster({
			shoubyoumeicode: shoubyoumeicode,
			valid_from: util.incDay(valid_from, -1),
			valid_upto: valid_upto
		});
		conti.exec([
			function(done){
				m.batchSave(conn, [master1, master2], done);
			},
			function(done){
				db.getShoubyoumeiMaster(conn, shoubyoumeicode, at, function(err, result){
					expect(err).ok;
					done();
				})
			}
		], done);
	});


});
