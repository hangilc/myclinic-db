var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("hoken_shahokokuho");

describe("Testing shahokokuho", function(){
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
		var shahokokuho = util.mockShahokokuho();
		db.insertShahokokuho(conn, shahokokuho, function(err, shahokokuhoId){
			if( err ){
				done(err);
				return;
			}
			expect(shahokokuho.shahokokuho_id).above(0);
			expect(shahokokuhoId).above(0);
			expect(shahokokuho.shahokokuho_id).equal(shahokokuhoId);
			done();
		})
	});
	it("get", function(done){
		var shahokokuho = util.mockShahokokuho();
		db.insertShahokokuho(conn, shahokokuho, function(err, shahokokuhoId){
			if( err ){
				done(err);
				return;
			}
			db.getShahokokuho(conn, shahokokuhoId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				util.deleteUnusedShahokokuhoColumn(row);
				expect(row).eql(shahokokuho);
				done();
			})
		})
	});
	it("update", function(done){
		var shahokokuho = util.mockShahokokuho();
		db.insertShahokokuho(conn, shahokokuho, function(err, shahokokuhoId){
			if( err ){
				done(err);
				return;
			}
			util.alterShahokokuho(shahokokuho);
			db.updateShahokokuho(conn, shahokokuho, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getShahokokuho(conn, shahokokuhoId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					util.deleteUnusedShahokokuhoColumn(row);
					expect(row).eql(shahokokuho);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var shahokokuho = util.mockShahokokuho();
		db.insertShahokokuho(conn, shahokokuho, function(err, shahokokuhoId){
			if( err ){
				done(err);
				return;
			}
			db.deleteShahokokuho(conn, shahokokuhoId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var shahokokuho = util.mockShahokokuho();
		db.insertShahokokuho(conn, shahokokuho, function(err, shahokokuhoId){
			if( err ){
				done(err);
				return;
			}
			db.deleteShahokokuho(conn, shahokokuhoId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findShahokokuho(conn, shahokokuhoId, function(err, row){
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