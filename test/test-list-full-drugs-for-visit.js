"use strict";

var util = require("./util");
var setup = require("./setup");
var conti = require("../lib/conti");
var db = require("../index");

function taskInsertVisit(conn, visit){
	return function(done){
		db.insertVisit(conn, visit, function(err){
			if( err ){
				done(err);
				return;
			}
			done();
		})
	}
}

function mockIyakuhinMasters(n, props){
	var masters = [];
	for(var i=0;i<n;i++){
		masters.push(util.mockIyakuhinMaster(props));
	}
	return masters;
}

function batchInsertIyakuhinMasters(conn, masters){
	return conti.forEach(masters, function(master, done){
		db.insertIyakuhinMaster(conn, master, done);
	});
}

function mockDrugs(visit, masters){
	return masters.map(function(master){
		return util.mockDrug({
			visit_id: visit.visit_id,
			d_iyakuhincode: master.iyakuhincode
		});
	})
}

function taskBatchInsertDrugs(conn, drugs){
	console.log("drugs", drugs);
	return conti.forEach(drugs, function(drug, done){
		db.insertDrug(conn, drug, done);
	});
}

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, ["iyakuhin_master_arch"], ["visit", "visit_drug"], done);
	}, done);
}

describe("Testing listFullDrugsForVisit", function(){
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
		});
	});

	afterEach(function(done){
		setup.release(conn, done);
	});

	afterEach(initDb);

	it("empty case", function(done){
		var valid_from = "2016-04-01";
		var valid_upto = "2018-03-31";
		var at = "2016-06-27 15:41:27";
		var visit = util.mockVisit({v_datetime: at});
		var masters = mockIyakuhinMasters(3, {
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var drugs;

		conti.exec([
			taskInsertVisit(conn, visit),
			taskBatchInsertIyakuhinMasters(conn, masters),
			function(done){
				drugs = mockDrugs(visit, masters);
				console.log(drugs);
				done();
			},
			taskBatchInsertDrugs(conn, drugs)
		], function(err){
			if( err ){
				done(err);
				return;
			}
			console.log(visit);
			console.log(masters);
			console.log(drugs);
			done();
		})
	});
});