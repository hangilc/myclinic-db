"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("conti");
var m = require("./model");

var initDb = util.createClearTableFun(["shuushokugo_master"]);

describe("Testing shuushokugo master", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("insert", function(done){
		var data = util.mockShuushokugoMaster();
		db.insertShuushokugoMaster(conn, data, done);
	});

	it("find (none)", function(done){
		db.findShuushokugoMaster(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).null;
			done();
		})
	});

	it("find (one)", function(done){
		var master = m.shuushokugoMaster();
		conti.exec([
			function(done){
				master.save(conn, done);
			},
			function(done){
				var shuushokugocode = master.data.shuushokugocode;
				db.findShuushokugoMaster(conn, shuushokugocode, function(err, result){
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

	it("get (none)", function(done){
		db.getShuushokugoMaster(conn, 0, function(err, result){
			expect(err).ok;
			done();
		})
	});

	it("get (one)", function(done){
		var master = m.shuushokugoMaster();
		conti.exec([
			function(done){
				master.save(conn, done);
			},
			function(done){
				var shuushokugocode = master.data.shuushokugocode;
				db.getShuushokugoMaster(conn, shuushokugocode, function(err, result){
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

})
