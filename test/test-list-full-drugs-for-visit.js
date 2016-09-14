"use strict";

var util = require("./util");
var setup = require("./setup");
var conti = require("conti");
var db = require("../index");
var expect = require("chai").expect;

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

function taskBatchInsertIyakuhinMasters(conn, masters){
	return function(done){
		conti.forEach(masters, function(master, done){
			db.insertIyakuhinMaster(conn, master, done);
		}, done);
	}
	// return conti.taskForEach(masters, function(master, done){
	// 	db.insertIyakuhinMaster(conn, master, done);
	// });
}

function mockDrugs(visit, masters){
	var drugs = [];
	var fullDrugs = [];
	masters.forEach(function(master){
		var drug = util.mockDrug({
			visit_id: visit.visit_id,
			d_iyakuhincode: master.iyakuhincode
		});
		drugs.push(drug);
		fullDrugs.push({
			drug: drug,
			master: master
		});
	})
	return {
		drugs: drugs,
		fullDrugs: fullDrugs
	};
}

function taskBatchInsertDrugs(conn, drugs){
	return function(done){
		if( typeof drugs === "function" ){
			drugs = drugs();
		}
		conti.forEach(drugs, function(drug, done){
			db.insertDrug(conn, drug, done);
		}, done);
	}
	// return conti.taskForEach(drugs, function(drug, done){
	// 	db.insertDrug(conn, drug, done);
	// });
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
		var at = "2016-06-27 15:41:27";
		var visit = util.mockVisit({v_datetime: at});
		conti.exec([
			taskInsertVisit(conn, visit)
		], function(err){
			db.listFullDrugsForVisit(conn, visit.visit_id, visit.v_datetime, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql([]);
				done();
			})
		});
	})

	it("simple case", function(done){
		var valid_from = "2016-04-01";
		var valid_upto = "2018-03-31";
		var at = "2016-06-27 15:41:27";
		var visit = util.mockVisit({v_datetime: at});
		var masters = mockIyakuhinMasters(3, {
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var drugs, fullDrugs;

		conti.exec([
			taskInsertVisit(conn, visit),
			taskBatchInsertIyakuhinMasters(conn, masters),
			function(done){
				var result = mockDrugs(visit, masters);
				drugs = result.drugs;
				fullDrugs = result.fullDrugs;
				done();
			},
			taskBatchInsertDrugs(conn, function(){ return drugs; })
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = fullDrugs.map(function(item){
				return util.assign({}, item.drug, item.master);
			});
			db.listFullDrugsForVisit(conn, visit.visit_id, visit.v_datetime, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(ans);
				done();
			})
		})
	});
});