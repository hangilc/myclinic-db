"use strict";

var expect = require("chai").expect;
var db = require("../index");
var util = require("./util");
var setup = require("./setup");
var conti = require("./conti");
var m = require("./model");

function resetTables(conn, done){
	util.initTables(conn, 
		["iyakuhin_master_arch", "shinryoukoui_master_arch", "tokuteikizai_master_arch", "visit_gazou_label"], 
		["visit", "visit_text", "visit_shinryou", "visit_drug", "visit_conduct",
		 "visit_conduct_drug", "visit_conduct_shinryou", "visit_conduct_kizai",
		 "visit_charge", "hoken_shahokokuho", "hoken_koukikourei", "hoken_roujin",
		 "kouhi"], 
		done);
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
				visit.conducts = [];
				visit.charge = null;
				expect(result).eql(visit);
				done();
			})
		})
	});

	it("simple", function(done){
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var patientId = 1000;
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
		visit.save(conn, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getFullVisit(conn, visit.data.visit_id, function(err, result){
				if( err ){
					done(err);
					return;
				}
				console.log(result);
				expect(result).eql(visit.getFullData());
				done();
			})
		})
	})
})