var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("visit_conduct_kizai");

describe("Testing conduct kizai", function(){
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
		var conductKizai = util.mockConductKizai();
		db.insertConductKizai(conn, conductKizai, function(err, conductKizaiId){
			if( err ){
				done(err);
				return;
			}
			expect(conductKizai.id).above(0);
			expect(conductKizaiId).above(0);
			expect(conductKizai.id).equal(conductKizaiId);
			done();
		})
	});
	it("get", function(done){
		var conductKizai = util.mockConductKizai();
		db.insertConductKizai(conn, conductKizai, function(err, conductKizaiId){
			if( err ){
				done(err);
				return;
			}
			db.getConductKizai(conn, conductKizaiId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(conductKizai);
				done();
			})
		})
	});
	it("update", function(done){
		var conductKizai = util.mockConductKizai();
		db.insertConductKizai(conn, conductKizai, function(err, conductKizaiId){
			if( err ){
				done(err);
				return;
			}
			util.alterConductKizai(conductKizai);
			db.updateConductKizai(conn, conductKizai, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getConductKizai(conn, conductKizaiId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).eql(conductKizai);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var conductKizai = util.mockConductKizai();
		db.insertConductKizai(conn, conductKizai, function(err, conductKizaiId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConductKizai(conn, conductKizaiId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var conductKizai = util.mockConductKizai();
		db.insertConductKizai(conn, conductKizai, function(err, conductKizaiId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConductKizai(conn, conductKizaiId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findConductKizai(conn, conductKizaiId, function(err, row){
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