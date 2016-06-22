var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("hoken_roujin");

describe("Testing roujin", function(){
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
		var roujin = util.mockRoujin();
		db.insertRoujin(conn, roujin, function(err, roujinId){
			if( err ){
				done(err);
				return;
			}
			expect(roujin.roujin_id).above(0);
			expect(roujinId).above(0);
			expect(roujin.roujin_id).equal(roujinId);
			done();
		})
	});
	it("get", function(done){
		var roujin = util.mockRoujin();
		db.insertRoujin(conn, roujin, function(err, roujinId){
			if( err ){
				done(err);
				return;
			}
			db.getRoujin(conn, roujinId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				util.deleteUnusedRoujinColumn(row);
				expect(row).eql(roujin);
				done();
			})
		})
	});
	it("update", function(done){
		var roujin = util.mockRoujin();
		db.insertRoujin(conn, roujin, function(err, roujinId){
			if( err ){
				done(err);
				return;
			}
			util.alterRoujin(roujin);
			db.updateRoujin(conn, roujin, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getRoujin(conn, roujinId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					util.deleteUnusedRoujinColumn(row);
					expect(row).eql(roujin);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var roujin = util.mockRoujin();
		db.insertRoujin(conn, roujin, function(err, roujinId){
			if( err ){
				done(err);
				return;
			}
			db.deleteRoujin(conn, roujinId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var roujin = util.mockRoujin();
		db.insertRoujin(conn, roujin, function(err, roujinId){
			if( err ){
				done(err);
				return;
			}
			db.deleteRoujin(conn, roujinId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findRoujin(conn, roujinId, function(err, row){
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
})