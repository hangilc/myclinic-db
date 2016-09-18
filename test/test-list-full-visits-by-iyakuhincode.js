"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var conti = require("conti");
var helper = require("./helper");

describe("Testing listFullVisitsByIyakuhincode", function(){

	it("empty", function(done){
		var conn = setup.getConnection();
		db.listFullVisitsByIyakuhincode(conn, 0, 0, 0, 10, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var conn = setup.getConnection();
		var patient = {};
		var validInterval = new helper.ValidInterval();
		var iyakuhinMasters = helper.objArray(1, validInterval);
		var visits, resultList;
		conti.exec([
			helper.taskInsertIyakuhinMaster(conn, iyakuhinMasters),
			helper.taskInsertPatient(conn, patient),
			function(done){
				var at = validInterval.valid_from;
				visits = helper.objArray(1, function(visit){
					visit.patient_id = patient.patient_id;
					visit.v_datetime = at.add(1, "week").clone();
				});
				helper.assign(visits[0], {
					drugs: [
						{ d_iyakuhincode: iyakuhinMasters[0].iyakuhincode }
					]
				})
				helper.insertVisit(conn, visits, done);
			},
			function(done){
				var patientId = patient.patient_id;
				var iyakuhincode = iyakuhinMasters[0].iyakuhincode;
				db.listFullVisitsByIyakuhincode(conn, patientId, iyakuhincode, 0, 10, function(err, result){
					if( err ){
						done(err);
						return;
					}
					resultList = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(resultList).eql([helper.toFullVisit(visits[0], {iyakuhinMasters: iyakuhinMasters})]);
			done();
		})
	});
});