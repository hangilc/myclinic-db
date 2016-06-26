var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("wqueue");

describe("Testing wqueue", function(){
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
		var wqueue = util.mockWqueue();
		db.insertWqueue(conn, wqueue, done);
	});
	it("get", function(done){
		var wqueue = util.mockWqueue();
		db.insertWqueue(conn, wqueue, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getWqueue(conn, wqueue.visit_id, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(wqueue);
				done();
			})
		})
	});
	it("update", function(done){
		var wqueue = util.mockWqueue();
		db.insertWqueue(conn, wqueue, function(err){
			if( err ){
				done(err);
				return;
			}
			util.alterWqueue(wqueue);
			db.updateWqueue(conn, wqueue, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getWqueue(conn, wqueue.visit_id, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).eql(wqueue);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var wqueue = util.mockWqueue();
		db.insertWqueue(conn, wqueue, function(err){
			if( err ){
				done(err);
				return;
			}
			db.deleteWqueue(conn, wqueue.visit_id, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var wqueue = util.mockWqueue();
		db.insertWqueue(conn, wqueue, function(err){
			if( err ){
				done(err);
				return;
			}
			db.deleteWqueue(conn, wqueue.visit_id, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findWqueue(conn, wqueue.visit_id, function(err, row){
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