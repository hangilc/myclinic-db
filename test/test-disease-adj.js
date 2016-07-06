"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

var initDb = util.createClearTableFun(["disease_adj"]);

describe("Testing disease adj", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("insert", function(done){
		var adj = util.mockDiseaseAdj();
		db.insertDiseaseAdj(conn, adj, function(err){
			if( err ){
				done(err);
				return;
			}
			expect(adj.disease_adj_id).above(0);
			done();
		});
	});

	it("get (fail)", function(done){
		db.getDiseaseAdj(conn, 0, function(err){
			expect(err).ok;
			done();
		});
	});

	it("get", function(done){
		var adj = m.diseaseAdj();
		conti.exec([
			function(done){
				m.batchSave(conn, [adj], done);
			}, function(done){
				db.getDiseaseAdj(conn, adj.data.disease_adj_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(adj.data);
					done();
				})
			}
		], done);
	});

	it("update", function(done){
		var adj = m.diseaseAdj();
		var modifiedData;
		conti.exec([
			function(done){
				m.batchSave(conn, [adj], done);
			},
			function(done){
				modifiedData = util.assign({}, adj.data, {
					shuushokugocode: adj.data.shuushokugocode + 1
				});
				db.updateDiseaseAdj(conn, modifiedData, done);
			},
			function(done){
				db.getDiseaseAdj(conn, adj.data.disease_adj_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql(modifiedData);
					done();
				})
			}
		], done);
	});

	it("delete", function(done){
		var adj = m.diseaseAdj();
		conti.exec([
			function(done){
				adj.save(conn, done);
			},
			function(done){
				db.deleteDiseaseAdj(conn, adj.data.disease_adj_id, done);
			}
		], done);
	});

})
