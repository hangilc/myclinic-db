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
		var iyakuhin_masters = helper.objArray(3);
		var visit1 = { drugs: [] };
		var visit2 = {};
		var visit3 = {};
		var visits = [visit1, visit2, visit3];
		conti.exec([
			function(done){
				helper.insertPatient(conn, patient, done);
			},
			function(done){
				visits.forEach(function(visit){
					visit.patient_id = patient.patient_id;
				})
				helper.insertVisit(conn, visits, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			console.log(visits);
			done();
		})
	});
});