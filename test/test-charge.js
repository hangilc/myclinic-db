var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("visit_charge");

describe("Testing charge", function(){
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
		var charge = util.mockCharge();
		db.insertCharge(conn, charge, done);
	});
	it("get", function(done){
		var charge = util.mockCharge();
		db.insertCharge(conn, charge, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getCharge(conn, charge.visit_id, function(err, row){
				if( err ){
					done(err);
					return;
				}
				util.deleteUnusedChargeColumn(row);
				expect(row).eql(charge);
				done();
			})
		})
	});
	it("update", function(done){
		var charge = util.mockCharge();
		db.insertCharge(conn, charge, function(err){
			if( err ){
				done(err);
				return;
			}
			util.alterCharge(charge);
			db.updateCharge(conn, charge, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getCharge(conn, charge.visit_id, function(err, row){
					if( err ){
						done(err);
						return;
					}
					util.deleteUnusedChargeColumn(row);
					expect(row).eql(charge);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var charge = util.mockCharge();
		db.insertCharge(conn, charge, function(err){
			if( err ){
				done(err);
				return;
			}
			db.deleteCharge(conn, charge.visit_id, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var charge = util.mockCharge();
		db.insertCharge(conn, charge, function(err){
			if( err ){
				done(err);
				return;
			}
			db.deleteCharge(conn, charge.visit_id, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findCharge(conn, charge.visit_id, function(err, row){
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