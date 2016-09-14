"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("conti");
var m = require("./model");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			[],
			["visit", "wqueue", "hoken_shahokokuho", "hoken_koukikourei", "hoken_roujin", "kouhi"],
			done);
	}, done);
}

var waitExam = util.WqueueStateWaitExam;

function nullVisit(){
	return {
		patient_id: 0,
		shahokokuho_id: 0,
		koukikourei_id: 0,
		roujin_id: 0,
		kouhi_1_id: 0,
		kouhi_2_id: 0,
		kouhi_3_id: 0
	};
}

describe("Testing start visit", function(){
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

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("simple", function(done){
		var patientId = 3210;
		db.startVisit(conn, patientId, at, function(err, visitId){
			if( err ){
				done(err);
				return;
			}
			expect(visitId).above(0);
			conti.exec([
				function(done){
					db.listVisitsFromRecent(conn, 1, function(err, result){
						if( err ){
							done(err);
							return;
						}
						expect(result.length).above(0);
						expect(visitId).equal(result[0].visit_id);
						done();
					})
				},
				function(done){
					db.listWqueue(conn, function(err, result){
						if( err ){
							done(err);
							return;
						}
						expect(result.length).above(0);
						expect(result[result.length-1]).eql({visit_id: visitId, wait_state: waitExam});
						done();
					})
				}
			], done);
		});
	});

	it("shahokokuho", function(done){
		var patientId = 3211;
		var shahokokuho = m.shahokokuho({
			patient_id: patientId,
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visitId;
		conti.exec([
			function(done){
				m.batchSave(conn, [shahokokuho], done);
			},
			function(done){
				db.startVisit(conn, patientId, at, function(err, visitId_){
					if( err ){
						done(err);
						return;
					}
					visitId = visitId_;
					expect(visitId).above(0);
					done();
				})
			},
			function(done){
				db.listVisitsFromRecent(conn, 1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.length).above(0);
					var ans = util.assign({}, nullVisit(), {
						visit_id: visitId,
						patient_id: patientId,
						v_datetime: at,
						shahokokuho_id: shahokokuho.data.shahokokuho_id
					})
					expect(result[0]).eql(ans);
					done();
				})
			},
			function(done){
				db.listWqueue(conn, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).length.above(0);
					expect(result[0]).eql({visit_id: visitId, wait_state: waitExam});
					done();
				});
			}
		], done);
	});

	it("koukikourei", function(done){
		var patientId = 3212;
		var koukikourei = m.koukikourei({
			patient_id: patientId,
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visitId;
		conti.exec([
			function(done){
				m.batchSave(conn, [koukikourei], done);
			},
			function(done){
				db.startVisit(conn, patientId, at, function(err, visitId_){
					if( err ){
						done(err);
						return;
					}
					visitId = visitId_;
					expect(visitId).above(0);
					done();
				})
			},
			function(done){
				db.listVisitsFromRecent(conn, 1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.length).above(0);
					var ans = util.assign({}, nullVisit(), {
						visit_id: visitId,
						patient_id: patientId,
						v_datetime: at,
						koukikourei_id: koukikourei.data.koukikourei_id
					})
					expect(result[0]).eql(ans);
					done();
				})
			},
			function(done){
				db.listWqueue(conn, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).length.above(0);
					expect(result[0]).eql({visit_id: visitId, wait_state: waitExam});
					done();
				});
			}
		], done);
	});

	it("roujin", function(done){
		var patientId = 3213;
		var roujin = m.roujin({
			patient_id: patientId,
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visitId;
		conti.exec([
			function(done){
				m.batchSave(conn, [roujin], done);
			},
			function(done){
				db.startVisit(conn, patientId, at, function(err, visitId_){
					if( err ){
						done(err);
						return;
					}
					visitId = visitId_;
					expect(visitId).above(0);
					done();
				})
			},
			function(done){
				db.listVisitsFromRecent(conn, 1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.length).above(0);
					var ans = util.assign({}, nullVisit(), {
						visit_id: visitId,
						patient_id: patientId,
						v_datetime: at,
						roujin_id: roujin.data.roujin_id
					})
					expect(result[0]).eql(ans);
					done();
				})
			},
			function(done){
				db.listWqueue(conn, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).length.above(0);
					expect(result[0]).eql({visit_id: visitId, wait_state: waitExam});
					done();
				});
			}
		], done);
	});

	it("kouhi", function(done){
		var patientId = 3214;
		var kouhiProps = {
			patient_id: patientId,
			valid_from: valid_from,
			valid_upto: valid_upto
		};
		var kouhi_1 = m.kouhi(kouhiProps);
		var kouhi_2 = m.kouhi(kouhiProps);
		var kouhi_3 = m.kouhi(kouhiProps);
		var visitId;
		conti.exec([
			function(done){
				m.batchSave(conn, [kouhi_1, kouhi_2, kouhi_3], done);
			},
			function(done){
				db.startVisit(conn, patientId, at, function(err, visitId_){
					if( err ){
						done(err);
						return;
					}
					visitId = visitId_;
					expect(visitId).above(0);
					done();
				})
			},
			function(done){
				db.listVisitsFromRecent(conn, 1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result.length).above(0);
					var ans = util.assign({}, nullVisit(), {
						visit_id: visitId,
						patient_id: patientId,
						v_datetime: at,
						kouhi_1_id: kouhi_1.data.kouhi_id,
						kouhi_2_id: kouhi_2.data.kouhi_id,
						kouhi_3_id: kouhi_3.data.kouhi_id
					})
					expect(result[0]).eql(ans);
					done();
				})
			},
			function(done){
				db.listWqueue(conn, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).length.above(0);
					expect(result[0]).eql({visit_id: visitId, wait_state: waitExam});
					done();
				});
			}
		], done);
	});

})
