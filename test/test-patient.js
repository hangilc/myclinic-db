var expect = require("chai").expect;
var setup = require("./setup");
var db = require("../index");
var moment = require("moment");

function clearPatientTable(done){
	setup.connect(function(err, conn){
		if( err ){
			done(err);
			return;
		}
		conn.query("delete from patient", function(err){
			if( err ){
				setup.release(conn, function(){
					done(err);
				});
				return;
			}
			setup.release(conn, done);
		})
	})
}

describe("Testing patient", function(){
	before(clearPatientTable);
	after(function(done){
		clearPatientTable(function(err){
			if( err ){
				done(err);
				return;
			}
			if( !setup.confirmNoLeak() ){
				done("connection leak");
				return;
			}
			done();
		})
	});

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

	function alterPatient(patient){
		patient.last_name += "modified";
		patient.first_name += "modified";
		patient.last_name_yomi += "modified";
		patient.first_name_yomi += "modified";
		patient.birth_day = moment(patient.birth_day).add(1, "days").format("YYYY-MM-DD");
		patient.sex = patient.sex === "M" ? "F" : "M";
		patient.phone += "modified";
		patient.address += "modified";
	}

	it("insert patient", function(done){
		var patient = mockPatient();
		db.insertPatient(conn, patient, function(err, patientId){
			if( err ){
				done(err);
				return;
			}
			expect(patientId).above(0);
			done();
		})
	});
	it("get patient", function(done){
		var patient = mockPatient();
		db.insertPatient(conn, patient, function(err, patientId){
			if( err ){
				done(err);
				return;
			}
			expect(patientId).above(0);
			patient.patient_id = patientId;
			db.getPatient(conn, patientId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(patient);
				done();
			})
		})
	});
	it("find patient (null)", function(done){
		db.findPatient(conn, 0, function(err, row){
			if( err ){
				done(err);
				return;
			}
			expect(row).null;
			done();
		})
	});
	it("find patient", function(done){
		var patient = mockPatient();
		db.insertPatient(conn, patient, function(err, patientId){
			if( err ){
				done(err);
				return;
			}
			expect(patientId).above(0);
			patient.patient_id = patientId;
			db.findPatient(conn, patientId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(patient);
				done();
			})
		})
	});
	it("update patient", function(done){
		var patient = mockPatient();
		db.insertPatient(conn, patient, function(err, patientId){
			if( err ){
				done(err);
				return;
			}
			expect(patientId).above(0);
			alterPatient(patient);
			patient.patient_id = patientId;
			db.updatePatient(conn, patient, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getPatient(conn, patientId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).eql(patient);
					done();
				})
			})
		})
	});
	it("delete patient", function(done){
		var patient = mockPatient();
		db.insertPatient(conn, patient, function(err, patientId){
			if( err ){
				done(err);
				return;
			}
			expect(patientId).above(0);
			db.deletePatient(conn, patientId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findPatient(conn, patientId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).null;
					done();
				})
			});
		})
	});
	it("delete patient (none)", function(done){
		db.deletePatient(conn, 0, function(err){
			expect(err).ok;
			done();
		});
	});
});