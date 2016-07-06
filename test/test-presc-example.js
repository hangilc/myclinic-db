"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

var initDb = util.createClearTableFun(["presc_example"]);

describe("Testing presc example", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("insert", function(done){
		var data = util.mockPrescExample();
		db.insertPrescExample(conn, data, done);
	});

	it("get", function(done){
		var ex = m.prescExample();
		conti.exec([
			function(done){
				ex.save(conn, done);
			},
			function(done){
				db.getPrescExample(conn, ex.data.presc_example_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(ex.data);
					done();
				})
			}
		], done);
	});

	it("get (fail)", function(done){
		db.getPrescExample(conn, 0, function(err){
			expect(err).ok;
			done();
		})
	});

	it("update", function(done){
		var ex = m.prescExample();
		var modified;
		conti.exec([
			function(done){
				ex.save(conn, done);
			},
			function(done){
				modified = util.assign({}, ex.data, {
					m_iyakuhincode: ex.data.m_iyakuhincode + 1,
					m_master_valid_from: util.incDay(ex.data.m_master_valid_from, 1),
					m_amount: ((+ex.data.m_amount) + 0.5) + "",
					m_usage: ex.data.m_usage + ":modified",
					m_days: ex.data.m_days + 1,
					m_comment: ex.data.m_comment + ":modified"
				});
				db.updatePrescExample(conn, modified, done);
			},
			function(done){
				db.getPrescExample(conn, ex.data.presc_example_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(modified);
					done();
				})
			}
		], done);
	});

	it("delete", function(done){
		var ex = m.prescExample();
		conti.exec([
			function(done){
				ex.save(conn, done);
			},
			function(done){
				db.deletePrescExample(conn, ex.data.presc_example_id, done);
			}
		], done);
	});

})
