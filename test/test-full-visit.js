"use strict";

var expect = require("chai").expect;
var db = require("../index");
var util = require("./util");
var setup = require("./setup");
var conti = require("./conti");

function resetTables(conn, done){
	util.initTables(conn, [], ["visit", "visit_text"], done);
}

describe("Testing full visit", function(){

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

	beforeEach(function(done){
		resetTables(conn, done);
	});

	afterEach(function(done){
		resetTables(conn, done);
	})

	afterEach(function(done){
		setup.release(conn, done);
	});

	it("empty", function(done){
		var visit = util.mockVisit({
			shahokokuho_id: 0,
			koukikourei_id: 0,
			roujin_id: 0,
			kouhi_1_id: 0,
			kouhi_2_id: 0,
			kouhi_3_id: 0
		});
		conti.exec([
			function(done){
				db.insertVisit(conn, util.mockVisit(), done);
			},
			function(done){
				db.insertVisit(conn, visit, done);
			},
			function(done){
				db.insertVisit(conn, util.mockVisit(), done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			db.getFullVisit(conn, visit.visit_id, function(err, result){
				if( err ){
					done(err);
					return;
				}
				visit.texts = [];
				visit.shahokokuho = null;
				visit.koukikourei = null;
				visit.roujin = null;
				visit.kouhi_list = [];
				visit.drugs = [];
				 visit.shinryou_list = [];
				// visit.conducts = [];
				// visit.charge = null;
				expect(result).eql(visit);
				done();
			})
		})
	});
})