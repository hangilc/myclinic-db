var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var m = require("./model");
var conti = require("../lib/conti");

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

describe("Testing count shinryou", function(){
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

	it("empty", function(done){
		db.countShinryouForVisit(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).equal(0);
			done();
		})
	})

	it("multiple", function(done){
		var visitId = 3296;
		var n = 3;
		var shinryouList = util.iterMap(n, function(i){
			var props = {
				visit_id: visitId
			}
			return m.shinryou(props);
		});
		conti.exec([
			function(done){
				m.batchSave(conn, shinryouList, done);
			},
			function(done){
				db.countShinryouForVisit(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).equal(n);
					done();
				})
			}
		], done);
	})
});