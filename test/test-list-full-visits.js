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
			["iyakuhin_master_arch", "shinryoukoui_master_arch", "tokuteikizai_master_arch", "visit_gazou_label"], 
			["visit", "visit_text", "visit_shinryou", "visit_drug", "visit_conduct",
			 "visit_conduct_drug", "visit_conduct_shinryou", "visit_conduct_kizai",
			 "visit_charge", "hoken_shahokokuho", "hoken_koukikourei", "hoken_roujin",
			 "kouhi"], 
			done);
	}, done);
}

function mkConduct(valid_from, valid_upto){
	var conduct = m.conduct();
	var i, drug, iMaster, shinryou, sMaster, kizai, kMaster;
	conduct.setGazouLabel(m.gazouLabel({label: "胸部単純"}));
	for(i=0;i<3;i++){
		iMaster = m.iyakuhinMaster({valid_from: valid_from, valid_upto: valid_upto});
		drug = m.conductDrug().setMaster(iMaster);
		conduct.addDrug(drug);
	}
	for(i=0;i<3;i++){
		sMaster = m.shinryouMaster({valid_from: valid_from, valid_upto: valid_upto});
		shinryou = m.conductShinryou().setMaster(sMaster);
		conduct.addShinryou(shinryou);
	}
	for(i=0;i<3;i++){
		kMaster = m.kizaiMaster({valid_from: valid_from, valid_upto: valid_upto});
		kizai = m.conductKizai().setMaster(kMaster);
		conduct.addKizai(kizai);
	}
	return conduct;
}

function mkVisit(patientId, valid_from, at, valid_upto){
	var visit = m.visit({
		patient_id: patientId,
		v_datetime: at, 
	});
	visit.addText(m.text());
	visit.addText(m.text());
	visit.setShahokokuho(m.shahokokuho({patient_id: patientId, valid_from: valid_from, valid_upto: valid_upto}));
	visit.setKoukikourei(m.koukikourei({patient_id: patientId, valid_from: valid_from, valid_upto: valid_upto}));
	visit.setRoujin(m.roujin({patient_id: patientId, valid_from: valid_from, valid_upto: valid_upto}));
	visit.addKouhi(m.kouhi({patient_id: patientId, valid_from: valid_from, valid_upto: valid_upto}));
	visit.addKouhi(m.kouhi({patient_id: patientId, valid_from: valid_from, valid_upto: valid_upto}));
	visit.addDrug(m.drug().setMaster(m.iyakuhinMaster({valid_from: valid_from, valid_upto: valid_upto})));
	visit.addDrug(m.drug().setMaster(m.iyakuhinMaster({valid_from: valid_from, valid_upto: valid_upto})));
	visit.addDrug(m.drug().setMaster(m.iyakuhinMaster({valid_from: valid_from, valid_upto: valid_upto})));
	visit.addDrug(m.drug().setMaster(m.iyakuhinMaster({valid_from: valid_from, valid_upto: valid_upto})));
	visit.addShinryou(m.shinryou().setMaster(m.shinryouMaster({valid_from: valid_from, valid_upto: valid_upto})));
	visit.addShinryou(m.shinryou().setMaster(m.shinryouMaster({valid_from: valid_from, valid_upto: valid_upto})));
	visit.addConduct(mkConduct(valid_from, valid_upto));
	visit.addConduct(mkConduct(valid_from, valid_upto));
	visit.setCharge(m.charge({charge: 1000}));
	return visit;
}

describe("Testing list full visits", function(){
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

	it("empty", function(done){
		db.listFullVisitsForPatient(conn, 1000, 10, 10, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		this.timeout(40000);
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var patientId = 1000;
		var total = 17;
		var offset = 10;
		var n = 5;
		var visits = util.iterMap(total, function(){
			return mkVisit(patientId, valid_from, at, valid_upto);
		});
		m.batchSave(conn, visits, function(err){
			if( err ){
				done(err);
				return;
			}
			db.listFullVisitsForPatient(conn, patientId, offset, n, function(err, result){
				if( err ){
					done(err);
					return;
				}
				var ans = visits.reverse().slice(offset, offset+n).map(function(visit){
					return visit.getFullData();
				});
				expect(result).eql(ans);
				done();
			})
		})
	})
})
