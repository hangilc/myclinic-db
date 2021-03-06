var expect = require("chai").expect;
var setup = require("./setup");
var db = require("../index");
var moment = require("moment");
var util = require("./util");

var clearPatientTable = util.createClearTableFun("patient");

describe("Testing patient", function(){
	before(clearPatientTable);
	after(clearPatientTable);

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

	var mockPatient = util.mockPatient;

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