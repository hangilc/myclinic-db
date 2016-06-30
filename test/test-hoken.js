"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			[],
			["hoken_shahokokuho", "hoken_koukikourei", "hoken_roujin", "kouhi"],
			done);
	}, done);
}

describe("Testing hoken", function(){
	var conn;

	beforeEach(initDb);

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

	afterEach(initDb);

	var old_valid_from = "2012-01-01";
	var old_valid_upto = "2013-12-31";
	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("empty", function(done){
		db.listAvailableHoken(conn, 1212, at, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql({
				shahokokuho_list: [],
				koukikourei_list: [],
				roujin_list: [],
				kouhi_list: []
			});
			done();
		})
	});

	it("shahokokuho", function(done){
		var patientId = 1232;
		var shahokokuho = m.shahokokuho({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		shahokokuho.save(conn, function(err){
			if( err ){
				done(err);
				return;
			}
			db.listAvailableHoken(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql({
					shahokokuho_list: [shahokokuho.data],
					koukikourei_list: [],
					roujin_list: [],
					kouhi_list: []
				});
				done();
			})
		})
	});

	it("koukikourei", function(done){
		var patientId = 1232;
		var koukikourei = m.koukikourei({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		koukikourei.save(conn, function(err){
			if( err ){
				done(err);
				return;
			}
			db.listAvailableHoken(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql({
					shahokokuho_list: [],
					koukikourei_list: [koukikourei.data],
					roujin_list: [],
					kouhi_list: []
				});
				done();
			})
		})
	});

	it("roujin", function(done){
		var patientId = 1232;
		var roujin = m.roujin({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		roujin.save(conn, function(err){
			if( err ){
				done(err);
				return;
			}
			db.listAvailableHoken(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql({
					shahokokuho_list: [],
					koukikourei_list: [],
					roujin_list: [roujin.data],
					kouhi_list: []
				});
				done();
			})
		})
	});

	it("kouhi", function(done){
		var patientId = 1232;
		var kouhi1 = m.kouhi({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var kouhi2 = m.kouhi({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var kouhi3 = m.kouhi({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		m.batchSave(conn, [kouhi1, kouhi2, kouhi3], function(err){
			if( err ){
				done(err);
				return;
			}
			db.listAvailableHoken(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql({
					shahokokuho_list: [],
					koukikourei_list: [],
					roujin_list: [],
					kouhi_list: [kouhi1.data, kouhi2.data, kouhi3.data]
				});
				done();
			})
		})
	});

	it("all", function(done){
		var patientId = 1232;
		var shahokokuho = m.shahokokuho({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var koukikourei = m.koukikourei({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var roujin = m.roujin({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var kouhi1 = m.kouhi({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var kouhi2 = m.kouhi({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var kouhi3 = m.kouhi({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var hoken = [shahokokuho, koukikourei, roujin, kouhi1, kouhi2, kouhi3]
		m.batchSave(conn, hoken, function(err){
			if( err ){
				done(err);
				return;
			}
			db.listAvailableHoken(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql({
					shahokokuho_list: [shahokokuho.data],
					koukikourei_list: [koukikourei.data],
					roujin_list: [roujin.data],
					kouhi_list: [kouhi1.data, kouhi2.data, kouhi3.data]
				});
				done();
			})
		})
	});

	it("shahokokuho with outdated", function(done){
		var patientId = 1232;
		var old = m.shahokokuho({patient_id: patientId,
				valid_from: old_valid_from, valid_upto: old_valid_upto})
		var shahokokuho = m.shahokokuho({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		m.batchSave(conn, [old, shahokokuho], function(err){
			if( err ){
				done(err);
				return;
			}
			db.listAvailableHoken(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql({
					shahokokuho_list: [shahokokuho.data],
					koukikourei_list: [],
					roujin_list: [],
					kouhi_list: []
				});
				done();
			})
		})
	});

	it("koukikourei with outdated", function(done){
		var patientId = 1232;
		var old = m.koukikourei({patient_id: patientId,
				valid_from: old_valid_from, valid_upto: old_valid_upto})
		var koukikourei = m.koukikourei({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		m.batchSave(conn, [old, koukikourei], function(err){
			if( err ){
				done(err);
				return;
			}
			db.listAvailableHoken(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql({
					shahokokuho_list: [],
					koukikourei_list: [koukikourei.data],
					roujin_list: [],
					kouhi_list: []
				});
				done();
			})
		})
	});

	it("roujin with outdated", function(done){
		var patientId = 1232;
		var old = m.roujin({patient_id: patientId,
				valid_from: old_valid_from, valid_upto: old_valid_upto})
		var roujin = m.roujin({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		m.batchSave(conn, [old, roujin], function(err){
			if( err ){
				done(err);
				return;
			}
			db.listAvailableHoken(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql({
					shahokokuho_list: [],
					koukikourei_list: [],
					roujin_list: [roujin.data],
					kouhi_list: []
				});
				done();
			})
		})
	});

	it("kouhi with outdated", function(done){
		var patientId = 1232;
		var old = m.kouhi({patient_id: patientId,
				valid_from: old_valid_from, valid_upto: old_valid_upto})
		var kouhi1 = m.kouhi({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var kouhi2 = m.kouhi({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		var kouhi3 = m.kouhi({patient_id: patientId,
				valid_from: valid_from, valid_upto: valid_upto});
		m.batchSave(conn, [old, kouhi1, kouhi2, kouhi3], function(err){
			if( err ){
				done(err);
				return;
			}
			db.listAvailableHoken(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql({
					shahokokuho_list: [],
					koukikourei_list: [],
					roujin_list: [],
					kouhi_list: [kouhi1.data, kouhi2.data, kouhi3.data]
				});
				done();
			})
		})
	});

})
