var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var conti = require("conti");
var m = require("./model");

var clearTable = util.createClearTableFun(["visit_charge", "visit"]);

describe("Testing charge", function(){

	var conn;

	beforeEach(clearTable);
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
	afterEach(clearTable);

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
	});

	it("set (insert)", function(done){
		var chargeValue = 1480;
		var visitId = 3000;
		conti.exec([
			function(done){
				db.setChargeValue(conn, visitId, chargeValue, done);
			},
			function(done){
				db.getCharge(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = {
						visit_id: visitId,
						charge: chargeValue
					};
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("set (update)", function(done){
		var chargeValue = 1480;
		var visitId = 3000;
		conti.exec([
			function(done){
				db.insertCharge(conn, {visit_id: visitId, charge: 0}, done);
			},
			function(done){
				db.setChargeValue(conn, visitId, chargeValue, done);
			},
			function(done){
				db.getCharge(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = {
						visit_id: visitId,
						charge: chargeValue
					};
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});
});