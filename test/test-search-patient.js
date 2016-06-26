"use strict";

var expect = require("chai").expect;
var setup = require("./setup");
var util = require("./util");
var conti = require("./conti");
var db = require("../index");

var clearTable = util.createClearTableFun("patient");

var patients = {
	p1: { last_name: "鈴木", first_name: "弘子", last_name_yomi: "すずき", first_name_yomi: "ひろこ" },
	p2: { last_name: "田中", first_name: "元子", last_name_yomi: "たなか", first_name_yomi: "もとこ" },
	p3: { last_name: "鈴木", first_name: "隆", last_name_yomi: "すずき", first_name_yomi: "たかし" },
	p4: { last_name: "鈴木", first_name: "美智子", last_name_yomi: "すずき", first_name_yomi: "みちこ" },
	p5: { last_name: "松本", first_name: "等", last_name_yomi: "まつもと", first_name_yomi: "ひとし" }
}

function setupPatients(done){
	util.withConnect(function(conn, cb){
		conti.exec([
			conti.forEachKey(patients, function(key, cb){
				var p = patients[key];
				p = util.mockPatient(p);
				patients[key] = p;
				db.insertPatient(conn, p, cb);
			})
		],
		cb);
	},
	done);
}

describe("Testing searchPatient", function(){
	before(clearTable);
	before(setupPatients);
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

	it("search by patient_id", function(done){
		db.searchPatient(conn, patients.p1.patient_id + "", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p1]);
			done();
		})
	});

	it("search by patient_id (no match)", function(done){
		db.searchPatient(conn, "0", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("search by last name", function(done){
		db.searchPatient(conn, "鈴木", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p3, patients.p1, patients.p4]);
			done();
		})
	});

	it("search by last name (no match)", function(done){
		db.searchPatient(conn, "橋本", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("search by first name", function(done){
		db.searchPatient(conn, "子", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p1, patients.p4, patients.p2]);
			done();
		})
	})

	it("search by last name yomi", function(done){
		db.searchPatient(conn, "ず", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p3, patients.p1, patients.p4]);
			done();
		})
	})

	it("search by first name yomi", function(done){
		db.searchPatient(conn, "こ", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p1, patients.p4, patients.p2]);
			done();
		})
	})

	it("search by first/last name yomi", function(done){
		db.searchPatient(conn, "と", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p2, patients.p5]);
			done();
		})
	})

	it("search by last and first names", function(done){
		db.searchPatient(conn, "鈴木 子", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p1, patients.p4]);
			done();
		})
	})

	it("search by last and first names (zenkaku space)", function(done){
		db.searchPatient(conn, "鈴木　子", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p1, patients.p4]);
			done();
		})
	})

	it("search by last and first names (multiple spaces)", function(done){
		db.searchPatient(conn, "　 鈴木　子   　", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p1, patients.p4]);
			done();
		})
	})

	it("search by empty text", function(done){
		db.searchPatient(conn, "", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	})

	it("search by text with only spaces (including zenkaku)", function(done){
		db.searchPatient(conn, " 　　  　", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	})

	it("search composite (1)", function(done){
		db.searchPatient(conn, "すずき　子", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([patients.p1, patients.p4]);
			done();
		})
	})
});