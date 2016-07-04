var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var conti = require("../lib/conti");
var m = require("./model");

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
		});
	});

	it("insert with null shinryoucode", function(done){
		var conductShinryou = util.mockConductShinryou({shinryoucode: null});
		db.insertConductShinryou(conn, conductShinryou, function(err, conductShinryouId){
			expect(err).ok;
			done();
		});		
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

describe("Testing count conduct shinryou", function(){
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
		db.countConductShinryouForConduct(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).equal(0);
			done();
		})
	});

	it("multiple", function(done){
		var conductId = 120;
		var n = 3;
		var shinryouList = util.iterMap(n, function(i){
			var props = {
				visit_conduct_id: conductId
			};
			return m.conductShinryou(props);
		});
		conti.exec([
			function(done){
				m.batchSave(conn, shinryouList, done);
			},
			function(done){
				db.countConductShinryouForConduct(conn, conductId, function(err, result){
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
