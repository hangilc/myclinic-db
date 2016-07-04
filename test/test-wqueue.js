var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var conti = require("../lib/conti");
var m = require("./model");

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

describe("Testing tryDeleteWqueue", function(){
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

	it("nothing to delete", function(done){
		db.tryDeleteWqueue(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).false;
			done();
		})
	});

	it("delete one", function(done){
		var visitId = 32514;
		var wqueue = m.wqueue({visit_id: visitId});
		conti.exec([
			function(done){
				wqueue.save(conn, done);
			},
			function(done){
				db.tryDeleteWqueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).true;
					done();
				})
			}
		], done);
	});

	it("delete one (case 2)", function(done){
		var visitId = 32514;
		var wqueue = m.wqueue({visit_id: visitId});
		var wqueue2 = m.wqueue({visit_id: visitId+1});
		conti.exec([
			function(done){
				wqueue.save(conn, done);
			},
			function(done){
				db.tryDeleteWqueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).true;
					done();
				})
			}
		], done);
	});


});