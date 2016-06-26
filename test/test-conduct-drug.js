var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("visit_conduct_drug");

describe("Testing conduct drug", function(){
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
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			expect(conductDrug.id).above(0);
			expect(conductDrugId).above(0);
			expect(conductDrug.id).equal(conductDrugId);
			done();
		})
	});
	it("get", function(done){
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			db.getConductDrug(conn, conductDrugId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(conductDrug);
				done();
			})
		})
	});
	it("update", function(done){
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			util.alterConductDrug(conductDrug);
			db.updateConductDrug(conn, conductDrug, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getConductDrug(conn, conductDrugId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).eql(conductDrug);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConductDrug(conn, conductDrugId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConductDrug(conn, conductDrugId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findConductDrug(conn, conductDrugId, function(err, row){
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