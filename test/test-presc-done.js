"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var util = require("./util");
var conti = require("../lib/conti");

describe("Testing prescDone", function(){
	var conn;

	beforeEach(function(){
		conn = setup.getConnection();
	});

	beforeEach(function(done){
		util.clearTables(conn, ["visit_drug", "pharma_queue", "wqueue"], done);
	})

	it("simple", function(done){
		var visit_id = 1000;
		var drugs = [];
		var drugsAfter, wqueueAfter, pharmaQueueAfter;
		for(var i=1;i<=3;i++){
			drugs.push(util.mockDrug({visit_id: visit_id}));
		}
		conti.exec([
			function(done){
				conti.forEach(drugs, function(drug, done){
					db.insertDrug(conn, drug, done);
				}, done);
			},
			function(done){
				db.insertWqueue(conn, util.mockWqueue({visit_id: visit_id}), done);
			},
			function(done){
				db.insertPharmaQueue(conn, util.mockPharmaQueue({visit_id: visit_id}), done);
			},
			function(done){
				db.prescDone(conn, visit_id, done);
			},
			function(done){
				db.listDrugsForVisit(conn, visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					drugsAfter = result;
					done();
				})
			},
			function(done){
				db.findWqueue(conn, visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					wqueueAfter = result;
					done();
				})
			},
			function(done){
				db.findPharmaQueue(conn, visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					pharmaQueueAfter = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(drugsAfter.length).equal(drugs.length);
			for(i=0;i<drugs.length;i++){
				var d = drugs[i];
				var e = drugsAfter[i];
				expect(e).eql(util.assign({}, d, {
					d_prescribed: 1
				}))
			}
			expect(wqueueAfter).null;
			expect(pharmaQueueAfter).null;
			done();
		})
	})
});