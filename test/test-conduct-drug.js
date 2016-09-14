var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var m = require("./model");
var conti = require("conti");

var clearTable = util.createClearTableFun("visit_conduct_drug");

describe("Testing conduct drug", function(){
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
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			expect(conductDrug.id).above(0);
			expect(conductDrugId).above(0);
			expect(conductDrug.id).equal(conductDrugId);
			done();
		})
	});
	it("get", function(done){
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			db.getConductDrug(conn, conductDrugId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(conductDrug);
				done();
			})
		})
	});
	it("update", function(done){
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			util.alterConductDrug(conductDrug);
			db.updateConductDrug(conn, conductDrug, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getConductDrug(conn, conductDrugId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).eql(conductDrug);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConductDrug(conn, conductDrugId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var conductDrug = util.mockConductDrug();
		db.insertConductDrug(conn, conductDrug, function(err, conductDrugId){
			if( err ){
				done(err);
				return;
			}
			db.deleteConductDrug(conn, conductDrugId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findConductDrug(conn, conductDrugId, function(err, row){
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

describe("Testing count conduct drug", function(){
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
		db.countConductDrugsForConduct(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).equal(0);
			done();
		})
	});

	it("multiple", function(done){
		var conductId = 321;
		var n = 3;
		var drugs = util.iterMap(n, function(i){
			return m.conductDrug({
				visit_conduct_id: conductId
			});
		});
		conti.exec([
			function(done){
				m.batchSave(conn, drugs, done);
			},
			function(done){
				db.countConductDrugsForConduct(conn, conductId, function(err, result){
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

describe("Testing listConductDrugsForConduct", function(){
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
		db.listConductDrugsForConduct(conn, 0, function(err, result){
			expect(err).not;
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var conductId = 321;
		var n = 3;
		var drugs = util.iterMap(n, function(i){
			return m.conductDrug({
				visit_conduct_id: conductId
			});
		});
		conti.exec([
			function(done){
				m.batchSave(conn, drugs, done);
			},
			function(done){
				db.listConductDrugsForConduct(conn, conductId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = drugs.map(function(drug){
						return drug.data;
					});
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	})
});
