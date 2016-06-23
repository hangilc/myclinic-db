var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("visit_conduct_shinryou");

describe("Testing conduct shinryou", function(){
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
		var conductShinryou = util.mockConductShinryou();
		db.insertConductShinryou(conn, conductShinryou, function(err, conductShinryouId){
			if( err ){
				done(err);
				return;
			}
			expect(conductShinryou.id).above(0);
			expect(conductShinryouId).above(0);
			expect(conductShinryou.id).equal(conductShinryouId);
			done();
		})
	});
	it("get", function(done){
		var conductShinryou = util.mockConductShinryou();
		db.insertConductShinryou(conn, conductShinryou, function(err, conductShinryouId){
			if( err ){
				done(err);
				return;
			}
			db.getConductShinryou(conn, conductShinryouId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				util.deleteUnusedConductShinryouColumn(row);
				expect(row).eql(conductShinryou);
				done();
			})
		})
	});
	it("update", function(done){
		var conductShinryou = util.mockConductShinryou();
		db.insertConductShinryou(conn, conductShinryou, function(err, conductShinryouId){
			if( err ){
				done(err);
				return;
			}
			util.alterConductShinryou(conductShinryou);
			db.updateConductShinryou(conn, conductShinryou, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getConductShinryou(conn, conductShinryouId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					util.deleteUnusedConductShinryouColumn(row);
					expect(row).eql(conductShinryou);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var conductShinryou = util.mockConductShinryou();
		db.insertConductShinryou(conn, conductShinryou, function(err, conductShinryouId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConductShinryou(conn, conductShinryouId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var conductShinryou = util.mockConductShinryou();
		db.insertConductShinryou(conn, conductShinryou, function(err, conductShinryouId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConductShinryou(conn, conductShinryouId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findConductShinryou(conn, conductShinryouId, function(err, row){
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