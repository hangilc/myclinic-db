var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("hoken_koukikourei");

describe("Testing koukikourei", function(){
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
		var koukikourei = util.mockKoukikourei();
		db.insertKoukikourei(conn, koukikourei, function(err, koukikoureiId){
			if( err ){
				done(err);
				return;
			}
			expect(koukikourei.koukikourei_id).above(0);
			expect(koukikoureiId).above(0);
			expect(koukikourei.koukikourei_id).equal(koukikoureiId);
			done();
		})
	});
	it("get", function(done){
		var koukikourei = util.mockKoukikourei();
		db.insertKoukikourei(conn, koukikourei, function(err, koukikoureiId){
			if( err ){
				done(err);
				return;
			}
			db.getKoukikourei(conn, koukikoureiId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(koukikourei);
				done();
			})
		})
	});
	it("update", function(done){
		var koukikourei = util.mockKoukikourei();
		db.insertKoukikourei(conn, koukikourei, function(err, koukikoureiId){
			if( err ){
				done(err);
				return;
			}
			util.alterKoukikourei(koukikourei);
			db.updateKoukikourei(conn, koukikourei, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getKoukikourei(conn, koukikoureiId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).eql(koukikourei);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var koukikourei = util.mockKoukikourei();
		db.insertKoukikourei(conn, koukikourei, function(err, koukikoureiId){
			if( err ){
				done(err);
				return;
			}
			db.deleteKoukikourei(conn, koukikoureiId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var koukikourei = util.mockKoukikourei();
		db.insertKoukikourei(conn, koukikourei, function(err, koukikoureiId){
			if( err ){
				done(err);
				return;
			}
			db.deleteKoukikourei(conn, koukikoureiId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findKoukikourei(conn, koukikoureiId, function(err, row){
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