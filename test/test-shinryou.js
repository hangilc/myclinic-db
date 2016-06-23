var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("visit_shinryou");

describe("Testing shinryou", function(){
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
		var shinryou = util.mockShinryou();
		db.insertShinryou(conn, shinryou, function(err, shinryouId){
			if( err ){
				done(err);
				return;
			}
			expect(shinryou.shinryou_id).above(0);
			expect(shinryouId).above(0);
			expect(shinryou.shinryou_id).equal(shinryouId);
			done();
		})
	});
	it("get", function(done){
		var shinryou = util.mockShinryou();
		db.insertShinryou(conn, shinryou, function(err, shinryouId){
			if( err ){
				done(err);
				return;
			}
			db.getShinryou(conn, shinryouId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				util.deleteUnusedShinryouColumn(row);
				expect(row).eql(shinryou);
				done();
			})
		})
	});
	it("update", function(done){
		var shinryou = util.mockShinryou();
		db.insertShinryou(conn, shinryou, function(err, shinryouId){
			if( err ){
				done(err);
				return;
			}
			util.alterShinryou(shinryou);
			db.updateShinryou(conn, shinryou, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getShinryou(conn, shinryouId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					util.deleteUnusedShinryouColumn(row);
					expect(row).eql(shinryou);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var shinryou = util.mockShinryou();
		db.insertShinryou(conn, shinryou, function(err, shinryouId){
			if( err ){
				done(err);
				return;
			}
			db.deleteShinryou(conn, shinryouId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var shinryou = util.mockShinryou();
		db.insertShinryou(conn, shinryou, function(err, shinryouId){
			if( err ){
				done(err);
				return;
			}
			db.deleteShinryou(conn, shinryouId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findShinryou(conn, shinryouId, function(err, row){
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