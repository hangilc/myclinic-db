"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

var initDb = util.createClearTableFun(["pharma_drug"]);

describe("Testing pharma drug", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("insert", function(done){
		db.insertPharmaDrug(conn, util.mockPharmaDrug(), done);
	});

	it("get", function(done){
		var drugs = util.iterMap(10, function(i){
			return m.pharmaDrug();
		});
		conti.exec([
			function(done){
				m.batchSave(conn, drugs, done);
			},
			function(done){
				var i = 2;
				db.getPharmaDrug(conn, drugs[i].data.iyakuhincode, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(drugs[i].data);
					done();
				})
			}
		], done);
	});

	it("get (fail)", function(done){
		db.getPharmaDrug(conn, 0, function(err, result){
			expect(err).ok;
			done();
		})
	})

})
