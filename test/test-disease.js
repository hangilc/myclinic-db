"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

var initDb = util.createClearTableFun(["disease"]);

describe("Testing disease", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("insert", function(done){
		var data = util.mockDisease();
		db.insertDisease(conn, data, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).above(0);
			done();
		});
	});

	it("insert with datetime", function(done){
		var start_date = "2016-06-26 21:35:21";
		var end_date = "2016-07-07 17:20:21";
		var data = util.mockDisease({
			start_date: start_date,
			end_date: end_date
		});
		var diseaseId;
		conti.exec([
			function(done){
				db.insertDisease(conn, data, function(err, result){
					if( err ){
						done(err);
						return;
					}
					diseaseId = result;
					done();
				});
			},
			function(done){
				db.getDisease(conn, diseaseId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.start_date).equal(util.sqlDatePart(start_date));
					expect(result.end_date).equal(util.sqlDatePart(end_date));
					done();
				})
			}
		], done);
	})

	it("get (fail)", function(done){
		db.getDisease(conn, 0, function(err, result){
			expect(err).ok;
			done();
		});
	});

	it("get", function(done){
		var disease = m.disease();
		conti.exec([
			function(done){
				m.batchSave(conn, [disease], done);
			},
			function(done){
				db.getDisease(conn, disease.data.disease_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(disease.data);
					done();
				})
			}
		], done);
	});

	it("update", function(done){
		var data = {
			patient_id: 3000,
			shoubyoumeicode: 1000,
			start_date: "2016-07-06",
			end_date: "0000-00-00", 
			end_reason: "N"
		};
		var diseaseId;
		var modified;
		conti.exec([
			function(done){
				db.insertDisease(conn, data, function(err, result){
					if( err ){
						done(err);
						return;
					}
					diseaseId = result;
					done();
				});
			},
			function(done){
				db.getDisease(conn, diseaseId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					modified = util.assign({}, result, {
						shoubyoumeicode: data.shoubyoumeicode + 1,
						start_date: util.incDay(data.start_date, 21),
						end_date: util.incDay(data.start_date, 30),
						end_reason: "C"
					});
					db.updateDisease(conn, modified, done);
				})
			},
			function(done){
				db.getDisease(conn, diseaseId, function(err, result){
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
		var disease = m.disease();
		conti.exec([
			function(done){
				disease.save(conn, done);
			},
			function(done){
				db.deleteDisease(conn, disease.data.disease_id, done);
			}
		], done);
	})

})
