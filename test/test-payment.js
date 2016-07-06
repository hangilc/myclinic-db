"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

var initDb = util.createClearTableFun(["visit_payment"]);

describe("Testing payment", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("insert", function(done){
		var data = util.mockPayment();
		db.insertPayment(conn, data, done);
	});

	it("get (fail)", function(done){
		db.getPayment(conn, 0, at, function(err){
			expect(err).ok;
			done();
		});
	});

	it("get", function(done){
		var pay = m.payment();
		conti.exec([
			function(done){
				pay.save(conn, done);
			},
			function(done){
				db.getPayment(conn, pay.data.visit_id, pay.data.paytime, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(pay.data);
					done();
				});
			}
		], done);
	});

	it("update", function(done){
		var pay = m.payment();
		var modified;
		conti.exec([
			function(done){
				pay.save(conn, done);
			},
			function(done){
				modified = util.assign({}, pay.data, {
					amount: pay.data.amount + 10
				});
				db.updatePayment(conn, modified, done);
			},
			function(done){
				db.getPayment(conn, pay.data.visit_id, pay.data.paytime, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).not.eql(pay.data);
					expect(result).eql(modified);
					done();
				});
			}
		], done);
	});

	it("delete", function(done){
		var pay = m.payment();
		conti.exec([
			function(done){
				pay.save(conn, done);
			},
			function(done){
				db.deletePayment(conn, pay.data.visit_id, pay.data.paytime, done);
			}
		], done);
	});

	it("delete (case 2)", function(done){
		var pay = m.payment();
		var pay2 = m.payment({visit_id: pay.data.visit_id});
		conti.exec([
			function(done){
				pay.save(conn, done);
			},
			function(done){
				pay2.save(conn, done);
			},
			function(done){
				db.deletePayment(conn, pay.data.visit_id, pay.data.paytime, done);
			}
		], done);
	});

});
