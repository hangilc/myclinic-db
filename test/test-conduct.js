var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var conti = require("../lib/conti");
var m = require("./model");

var clearTable = util.createClearTableFun("visit_conduct");

describe("Testing conduct", function(){
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
		var conduct = util.mockConduct();
		db.insertConduct(conn, conduct, function(err, conductId){
			if( err ){
				done(err);
				return;
			}
			expect(conduct.id).above(0);
			expect(conductId).above(0);
			expect(conduct.id).equal(conductId);
			done();
		})
	});
	it("get", function(done){
		var conduct = util.mockConduct();
		db.insertConduct(conn, conduct, function(err, conductId){
			if( err ){
				done(err);
				return;
			}
			db.getConduct(conn, conductId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(conduct);
				done();
			})
		})
	});
	it("update", function(done){
		var conduct = util.mockConduct();
		db.insertConduct(conn, conduct, function(err, conductId){
			if( err ){
				done(err);
				return;
			}
			util.alterConduct(conduct);
			db.updateConduct(conn, conduct, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getConduct(conn, conductId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).eql(conduct);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var conduct = util.mockConduct();
		db.insertConduct(conn, conduct, function(err, conductId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConduct(conn, conductId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var conduct = util.mockConduct();
		db.insertConduct(conn, conduct, function(err, conductId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConduct(conn, conductId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findConduct(conn, conductId, function(err, row){
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

describe("Testing count conducts", function(){
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

	it("empty", function(done){
		db.countConductsForVisit(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).equal(0);
			done();
		})
	});

	it("simple", function(done){
		var visitId = 8888;
		var n = 3;
		var conducts = util.iterMap(n, function(i){
			return m.conduct({
				visit_id: visitId
			});
		});
		conti.exec([
			function(done){
				m.batchSave(conn, conducts, done);
			},
			function(done){
				db.countConductsForVisit(conn, visitId, function(err, result){
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

	it("multiple visits", function(done){
		var visitId = 7777;
		var visitId2 = 6666;
		var n = 3;
		var conducts = util.iterMap(n, function(i){
			return m.conduct({
				visit_id: visitId
			});
		});
		var conducts2 = util.iterMap(n, function(i){
			return m.conduct({
				visit_id: visitId2
			});
		});
		conti.exec([
			function(done){
				m.batchSave(conn, conducts, done);
			},
			function(done){
				m.batchSave(conn, conducts2, done);
			},
			function(done){
				db.countConductsForVisit(conn, visitId, function(err, result){
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

})