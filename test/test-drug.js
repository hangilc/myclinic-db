var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var conti = require("conti");

var clearTable = util.createClearTableFun("visit_drug");

describe("Testing drug", function(){
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
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			expect(drug.drug_id).above(0);
			expect(drugId).above(0);
			expect(drug.drug_id).equal(drugId);
			done();
		})
	});
	it("get", function(done){
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			db.getDrug(conn, drugId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(drug);
				done();
			})
		})
	});
	it("update", function(done){
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			util.alterDrug(drug);
			db.updateDrug(conn, drug, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getDrug(conn, drugId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).eql(drug);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			db.deleteDrug(conn, drugId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var drug = util.mockDrug();
		db.insertDrug(conn, drug, function(err, drugId){
			if( err ){
				done(err);
				return;
			}
			db.deleteDrug(conn, drugId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findDrug(conn, drugId, function(err, row){
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

describe("Testing listDrugsForVisit", function(){
	var conn;

	beforeEach(function(){
		conn = setup.getConnection();
	});

	beforeEach(function(done){
		util.clearTables(conn, ["visit", "visit_drug"], done);
	});

	it("emtpy", function(done){
		db.listDrugsForVisit(conn, 0, function(err, result){
			if( err ){
				done(err);
			}
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var visit = util.mockVisit();
		var drugs = [];
		for(var i=1;i<=3;i++){
			drugs.push(util.mockDrug());
		}
		var list;
		conti.exec([
			function(done){
				db.insertVisit(conn, visit, done);
			},
			function(done){
				conti.forEach(drugs, function(drug, done){
					drug.visit_id = visit.visit_id;
					db.insertDrug(conn, drug, done);
				}, done);
			},
			function(done){
				db.listDrugsForVisit(conn, visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					list = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(list).eql(drugs);
			done();
		})
	})
});

describe("Testing listIyakuhincodesByPatient", function(){
	var conn;

	beforeEach(function(){
		conn = setup.getConnection();
	});

	beforeEach(function(done){
		util.clearTables(conn, ["visit_drug", "visit"], done);
	});

	it("empty", function(done){
		db.listIyakuhincodesByPatient(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		});
	});

	it("simple", function(done){
		var patientId = 1000;
		var iyakuhincode1 = 123, iyakuhincode2 = 124;
		var visits = [{}, {}, {}];
		conti.exec([
			function(done){
				conti.forEach(visits, function(visit, done){
					util.assign(visit, util.mockVisit(visit));
					visit.patient_id = patientId;
					db.insertVisit(conn, visit, done);
				}, done);
			},
			function(done){
				conti.forEach([iyakuhincode1], function(iyakuhincode, done){
					var visit_id = visits[0].visit_id;
					var drug = util.mockDrug({
						visit_id: visit_id,
						d_iyakuhincode: iyakuhincode
					});
					db.insertDrug(conn, drug, done)
				}, done);
			},
			function(done){
				conti.forEach([iyakuhincode1, iyakuhincode2], function(iyakuhincode, done){
					var visit_id = visits[1].visit_id;
					var drug = util.mockDrug({
						visit_id: visit_id,
						d_iyakuhincode: iyakuhincode
					});
					db.insertDrug(conn, drug, done)
				}, done);
			},
			function(done){
				conti.forEach([iyakuhincode2, iyakuhincode1], function(iyakuhincode, done){
					var visit_id = visits[2].visit_id;
					var drug = util.mockDrug({
						visit_id: visit_id,
						d_iyakuhincode: iyakuhincode
					});
					db.insertDrug(conn, drug, done)
				}, done);
			},
			function(done){
				db.listIyakuhincodesByPatient(conn, patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					list = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(list).eql([iyakuhincode1, iyakuhincode2]);
			done();
		})
	})
});

describe("Testing countVisitsByIyakuhincode", function(){
	var conn = setup.getConnection();

	beforeEach(function(done){
		util.clearTables(conn, ["visit", "visit_drug", "iyakuhin_master_arch"], done);
	});

	it("empty", function(done){
		db.countVisitsByIyakuhincode(conn, 0, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql(0);
			done();
		})
	});

	it("simple", function(done){
		var patientId = 1234;
		var masters = [util.mockIyakuhinMaster(), util.mockIyakuhinMaster()];
		var iyakuhincode1 = masters[0].iyakuhincode;
		var iyakuhincode2 = masters[1].iyakuhincode;
		var resultCount;
		var visits = [
			{
				patient_id: patientId,
				drugs: [
					{
						d_iyakuhincode: iyakuhincode1
					}
				]
			},
			{
				patient_id: patientId,
				drugs: [
					{
						d_iyakuhincode: iyakuhincode2
					}
				]
			},
			{
				patient_id: patientId,
				drugs: [
					{
						d_iyakuhincode: iyakuhincode1
					}
				]
			},
		];
		conti.exec([
			function(done){
				conti.forEach(masters, function(master, done){
					db.insertIyakuhinMaster(conn, master, done);
				}, done);
			},
			function(done){
				util.insertFullVisits(conn, visits, done);
			},
			function(done){
				db.countVisitsByIyakuhincode(conn, patientId, iyakuhincode1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					resultCount = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(resultCount).equal(2);
			done();
		})
	});
});