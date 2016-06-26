var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("kouhi");

describe("Testing kouhi", function(){
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
		var kouhi = util.mockKouhi();
		db.insertKouhi(conn, kouhi, function(err, kouhiId){
			if( err ){
				done(err);
				return;
			}
			expect(kouhi.kouhi_id).above(0);
			expect(kouhiId).above(0);
			expect(kouhi.kouhi_id).equal(kouhiId);
			done();
		})
	});
	it("get", function(done){
		var kouhi = util.mockKouhi();
		db.insertKouhi(conn, kouhi, function(err, kouhiId){
			if( err ){
				done(err);
				return;
			}
			db.getKouhi(conn, kouhiId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(kouhi);
				done();
			})
		})
	});
	it("update", function(done){
		var kouhi = util.mockKouhi();
		db.insertKouhi(conn, kouhi, function(err, kouhiId){
			if( err ){
				done(err);
				return;
			}
			util.alterKouhi(kouhi);
			db.updateKouhi(conn, kouhi, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getKouhi(conn, kouhiId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).eql(kouhi);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var kouhi = util.mockKouhi();
		db.insertKouhi(conn, kouhi, function(err, kouhiId){
			if( err ){
				done(err);
				return;
			}
			db.deleteKouhi(conn, kouhiId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var kouhi = util.mockKouhi();
		db.insertKouhi(conn, kouhi, function(err, kouhiId){
			if( err ){
				done(err);
				return;
			}
			db.deleteKouhi(conn, kouhiId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findKouhi(conn, kouhiId, function(err, row){
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

