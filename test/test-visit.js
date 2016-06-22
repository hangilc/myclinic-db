var expect = require("chai").expect;
var setup = require("./setup");
var util = require("./util");
var db = require("../index");

var clearVisitTable = util.createClearTableFun("visit");

function mockVisit(){
	return {
		patient_id: 199,
		v_datetime: "2016-06-22 11:51:03",
		shahokokuho_id: 1234,
		koukikourei_id: 0,
		roujin_id: 0,
		kouhi_1_id: 0,
		kouhi_2_id: 0,
		kouhi_3_id: 0
	};
}

function alterVisit(visit){
	visit.shahokokuho_id = alter(visit.shahokokuho_id);
	visit.koukikourei_id = alter(visit.koukikourei_id);
	visit.roujin_id = alter(visit.roujin_id);
	visit.kouhi_1_id = alter(visit.kouhi_1_id);
	visit.kouhi_2_id = alter(visit.kouhi_2_id);
	visit.kouhi_3_id = alter(visit.kouhi_3_id);

	function alter(num){
		return num === 0 ? 123 : 0;
	}
}

function deleteUnusedColumn(visit){
	delete visit.jihi;
}

describe("Testing visit", function(){
	before(clearVisitTable);
	after(clearVisitTable);

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
		var visit = mockVisit();
		db.insertVisit(conn, visit, function(err, visitId){
			if( err ){
				done(err);
				return;
			}
			expect(visitId).above(0);
			done();
		})
	});
	it("get", function(done){
		var visit = mockVisit();
		db.insertVisit(conn, visit, function(err, visitId){
			if( err ){
				done(err);
				return;
			}
			visit.visit_id = visitId;
			db.getVisit(conn, visitId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				deleteUnusedColumn(row);
				expect(row).eql(visit);
				done();
			})
		})
	});
	it("update", function(done){
		var visit = mockVisit();
		db.insertVisit(conn, visit, function(err, visitId){
			if( err ){
				done(err);
				return;
			}
			visit.visit_id = visitId;
			alterVisit(visit);
			db.updateVisit(conn, visit, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getVisit(conn, visitId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					deleteUnusedColumn(row);
					expect(row).eql(visit);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var visit = mockVisit();
		db.insertVisit(conn, visit, function(err, visitId){
			if( err ){
				done(err);
				return;
			}
			visit.visit_id = visitId;
			db.deleteVisit(conn, visitId, done);
		})
	});
	it("find", function(done){
		var visit = mockVisit();
		db.insertVisit(conn, visit, function(err, visitId){
			if( err ){
				done(err);
				return;
			}
			visit.visit_id = visitId;
			db.findVisit(conn, visitId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				deleteUnusedColumn(row);
				expect(row).eql(visit);
				done();
			})
		})
	});
	it("delete/find", function(done){
		var visit = mockVisit();
		db.insertVisit(conn, visit, function(err, visitId){
			if( err ){
				done(err);
				return;
			}
			db.deleteVisit(conn, visitId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findVisit(conn, visitId, function(err, row){
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