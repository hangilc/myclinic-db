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

function mockPatient(){
	return {
		last_name: "診療",
		first_name: "太郎",
		last_name_yomi: "しんりょう",
		first_name_yomi: "たろう",
		birth_day: "1957-06-02",
		sex: "M",
		phone: "03-1234-5678",
		address: "no where"
	};
}

function insertPatient(conn, mockIndex, cb){
	patient = mockPatient();
	patient.last_name += mockIndex;
	patient.first_name += mockIndex;
	patient.last_name_yomi += mockIndex;
	patient.first_name_yomi += mockIndex;
	db.insertPatient(conn, patient, function(err, patientId){
		if( err ){
			cb(err);
			return;
		}
		patient.patient_id = patientId;
		cb(null, patient);
	})
}

function prepareRecentVisits(conn, done){
	var visits = [], mockIndex = 1;
	conn.query("delete from visit", function(err){
		if( err ){
			done(err);
			return;
		}
		insertTestVisits(function(err){
			if( err ){
				done(err);
				return;
			}
			var recents = visits.slice(-30).map(function(item){
				return {
					patient_id: item.patient.patient_id,
					last_name: item.patient.last_name,
					first_name: item.patient.first_name,
					last_name_yomi: item.patient.last_name_yomi,
					first_name_yomi: item.patient.first_name_yomi,
					visit_id: item.visit_id
				};
			})
			done(null, recents.reverse());
		})
	});

	function insertTestVisits(cb){
		var n = 32;
		iter(0);

		function iter(i){
			if( i >= n ){
				cb();
				return;
			}
			insertPatient(conn, mockIndex++, function(err, patient){
				if( err ){
					cb(err);
					return;
				}
				var visit = mockVisit();
				visit.patient_id = patient.patient_id;
				visits.push(visit);
				db.insertVisit(conn, visit, function(err, visitId){
					if( err ){
						cb(err);
						return;
					}
					visit.visit_id = visitId;
					visit.patient = patient;
					iter(i+1);
				});
			})
		}
	}
}

function prepareCalcVisits(conn, cb){
	var visits = [], n = 3;
	conn.query("delete from visit", function(err){
		if( err ){
			cb(err);
			return;
		}
		insertPatient(conn, "", function(err, patient){
			if( err ){
				cb(err);
				return;
			}
			insertVisits(patient.patient_id, n, function(err){
				if( err ){
					cb(err);
					return;
				}
				cb(undefined, {patient_id: patient.patient_id, n: n});
			})
		})
	});

	function insertVisits(patientId, n, cb){
		iter(0);
		function iter(i){
			if( i >= n ){
				cb();
				return;
			}
			var visit = mockVisit();
			visit.patient_id = patientId;
			db.insertVisit(conn, visit, function(err, visitId){
				if( err ){
					cb(err);
					return;
				}
				visit.visit_id = visitId;
				visits.push(visit);
				iter(i+1);
			})
		}
	}
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
	});
	it("recentVisits", function(done){
		prepareRecentVisits(conn, function(err, prep){
			if( err ){
				done(err);
				return;
			}
			db.recentVisits(conn, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(prep);
				done();
			})
		})
	});
	it("calcVisits", function(done){
		prepareCalcVisits(conn, function(err, prep){
			if( err ){
				done(err);
				return;
			}
			var patientId = prep.patient_id;
			var n = prep.n;
			db.calcVisits(conn, patientId, function(err, count){
				if( err ){
					done(err);
					return;
				}
				expect(count).equal(n);
				done();
			})
		})
	})
});