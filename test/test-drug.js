var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("visit_drug");

describe("Testing drug", function(){
	before(clearTable);
	after(clearTable);

	var conn;

	beforeEach(function(done){
		setup.connect(function(err, conn_){
			if( err ){
				done(err);
				return;
			}
			conn = conn_;
			done();
		})
	});

	afterEach(function(done){
		setup.release(conn, done);
	});

	it("insert", function(done){
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			expect(drug.drug_id).above(0);
			expect(drugId).above(0);
			expect(drug.drug_id).equal(drugId);
			done();
		})
	});
	it("get", function(done){
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			db.getDrug(conn, drugId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				util.deleteUnusedDrugColumn(row);
				expect(row).eql(drug);
				done();
			})
		})
	});
	it("update", function(done){
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			util.alterDrug(drug);
			db.updateDrug(conn, drug, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getDrug(conn, drugId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					util.deleteUnusedDrugColumn(row);
					expect(row).eql(drug);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			db.deleteDrug(conn, drugId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			db.deleteDrug(conn, drugId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findDrug(conn, drugId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).null;
					done();
				})
			})
		})
	})
});