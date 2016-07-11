"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var model = require("./model");

var initDb = util.createClearTableFun(["visit_drug", "visit", "iyakuhin_master_arch"]);

describe("Testing search previous drug", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26";
	var valid_upto = "2018-03-31";

	it("emtpy", function(done){
		db.searchFullDrugForPatient(conn, 0, "テスト", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("1 patient 1 visit 1 drug", function(done){
		var patientId = 8372;
		var master = model.iyakuhinMaster({
			name: "カロナール",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visit = model.visit({
			v_datetime: at,
			patient_id: patientId
		});
		var drug = model.drug().setMaster(master);
		visit.addDrug(drug);
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "ロナ", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug.getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("1 patient 1 visit 2 drugs (same)", function(done){
		var patientId = 8372;
		var master = model.iyakuhinMaster({
			name: "カロナール",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visit = model.visit({
			v_datetime: at,
			patient_id: patientId
		});
		var drug1 = model.drug().setMaster(master);
		visit.addDrug(drug1);
		var drug2 = model.drug(drug1.data).setMaster(master);
		visit.addDrug(drug2);
		conti.exec([
			function(done){
				model.batchSave(conn, [visit], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "カロ", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug2.getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("1 patient 1 visit 2 drugs (different category)", function(done){
		var patientId = 8372;
		var master = model.iyakuhinMaster({
			name: "カロナール",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visit = model.visit({
			v_datetime: at,
			patient_id: patientId
		});
		var drug1 = model.drug({
			d_category: util.DrugCategoryNaifuku
		}).setMaster(master);
		visit.addDrug(drug1);
		var drug2 = model.drug(util.assign({}, drug1.data, {
			d_category: util.DrugCategoryTonpuku
		})).setMaster(master);
		visit.addDrug(drug2);
		conti.exec([
			function(done){
				model.batchSave(conn, [visit], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "ール", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug2.getFullData(), drug1.getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("1 patient 1 visit 2 drugs (different amount)", function(done){
		var patientId = 8372;
		var master = model.iyakuhinMaster({
			name: "カロナール",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visit = model.visit({
			v_datetime: at,
			patient_id: patientId
		});
		var drug1 = model.drug({
			d_amount: "3"
		}).setMaster(master);
		visit.addDrug(drug1);
		var drug2 = model.drug(util.assign({}, drug1.data, {
			d_amount: "2"
		})).setMaster(master);
		visit.addDrug(drug2);
		conti.exec([
			function(done){
				model.batchSave(conn, [visit], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "カロナール", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug2.getFullData(), drug1.getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("1 patient 1 visit 2 drugs (different usage)", function(done){
		var patientId = 8372;
		var master = model.iyakuhinMaster({
			name: "カロナール",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visit = model.visit({
			v_datetime: at,
			patient_id: patientId
		});
		var drug1 = model.drug({
			d_usage: "分３　毎食後"
		}).setMaster(master);
		visit.addDrug(drug1);
		var drug2 = model.drug(util.assign({}, drug1.data, {
			d_usage: "分２　朝夕食後"
		})).setMaster(master);
		visit.addDrug(drug2);
		conti.exec([
			function(done){
				model.batchSave(conn, [visit], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "カロナール", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug2.getFullData(), drug1.getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("1 patient 1 visit 2 drugs (different days)", function(done){
		var patientId = 8372;
		var master = model.iyakuhinMaster({
			name: "カロナール",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visit = model.visit({
			v_datetime: at,
			patient_id: patientId
		});
		var drug1 = model.drug({
			d_category: util.DrugCategoryNaifuku,
			d_days: 5
		}).setMaster(master);
		visit.addDrug(drug1);
		var drug2 = model.drug(util.assign({}, drug1.data, {
			d_days: 14
		})).setMaster(master);
		visit.addDrug(drug2);
		conti.exec([
			function(done){
				model.batchSave(conn, [visit], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "カロナール", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug2.getFullData(), drug1.getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("1 patient 1 visit 2 drugs (different days, gaiyou)", function(done){
		var patientId = 8372;
		var master = model.iyakuhinMaster({
			name: "カロナール",
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var visit = model.visit({
			v_datetime: at,
			patient_id: patientId
		});
		var drug1 = model.drug({
			d_category: util.DrugCategoryGaiyou,
			d_days: 5
		}).setMaster(master);
		visit.addDrug(drug1);
		var drug2 = model.drug(util.assign({}, drug1.data, {
			d_days: 14
		})).setMaster(master);
		visit.addDrug(drug2);
		conti.exec([
			function(done){
				model.batchSave(conn, [visit], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "カロナール", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug2.getFullData()];
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});
});

describe("Testing search full drug (1 patient 2 visits)", function(done){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at_1       = "2016-06-26";
	var at_2       = "2016-07-09";
	var valid_upto = "2018-03-31";
	var patientId = 1234;

	function makeMasters(names){
		var masters = {};
		names.forEach(function(name){
			masters[name] = model.iyakuhinMaster({
				name: name,
				valid_from: valid_from,
				valid_upto: valid_upto
			});
		})
		return masters;
	}

	function makeVisits(){
		return {
			visit_1: model.visit({
				patient_id: patientId,
				v_datetime: at_1
			}),
			visit_2: model.visit({
				patient_id: patientId,
				v_datetime: at_2
			})
		}
	}

	it("2 drugs 2 matches", function(done){
		var masters = makeMasters(["カロナール", "ロラタジン"]);
		var visits = makeVisits();
		var drug_1 = model.drug().setMaster(masters["カロナール"]);
		visits.visit_1.addDrug(drug_1);
		var drug_2 = model.drug().setMaster(masters["ロラタジン"]);
		visits.visit_2.addDrug(drug_2);
		conti.exec([
			function(done){
				model.batchSave(conn, [visits.visit_1, visits.visit_2], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "ロ", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug_2, drug_1].map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	})

	it("2 drugs 1 match (match first drug)", function(done){
		var masters = makeMasters(["カロナール", "ロラタジン"]);
		var visits = makeVisits();
		var drug_1 = model.drug().setMaster(masters["カロナール"]);
		visits.visit_1.addDrug(drug_1);
		var drug_2 = model.drug().setMaster(masters["ロラタジン"]);
		visits.visit_2.addDrug(drug_2);
		conti.exec([
			function(done){
				model.batchSave(conn, [visits.visit_1, visits.visit_2], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "ロナ", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug_1].map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	})

	it("2 drugs 1 match (match second drug)", function(done){
		var masters = makeMasters(["カロナール", "ロラタジン"]);
		var visits = makeVisits();
		var drug_1 = model.drug().setMaster(masters["カロナール"]);
		visits.visit_1.addDrug(drug_1);
		var drug_2 = model.drug().setMaster(masters["ロラタジン"]);
		visits.visit_2.addDrug(drug_2);
		conti.exec([
			function(done){
				model.batchSave(conn, [visits.visit_1, visits.visit_2], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patientId, "ロラ", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug_2].map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	})

});

describe("Testing search full drug for patient (2 patients, 2 visits each)", function(){
	var conn = setup.getConnection();

	beforeEach(initDb);
	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at_1       = "2016-06-26";
	var at_2       = "2016-07-09";
	var valid_upto = "2018-03-31";
	var patient_1_id = 2345;
	var patient_2_id = 5432;

	function makeMasters(names){
		var masters = {};
		names.forEach(function(name){
			masters[name] = model.iyakuhinMaster({
				name: name,
				valid_from: valid_from,
				valid_upto: valid_upto
			});
		})
		return masters;
	}


	it("2 matches", function(done){
		var masters = makeMasters(["アムロジピン", "アトルバスタチン", "ゾルピデム", "アドエア"]);
		var visit_1_of_patient_1 = model.visit({
			patient_id: patient_1_id,
			v_datetime: at_1 + " 09:23:11"
		})
		var visit_1_of_patient_2 = model.visit({
			patient_id: patient_2_id,
			v_datetime: at_1 + " 14:06:12"
		})
		var visit_2_of_patient_2 = model.visit({
			patient_id: patient_1_id,
			v_datetime: at_2 + " 11:32:22"
		})
		var visit_2_of_patient_1 = model.visit({
			patient_id: patient_1_id,
			v_datetime: at_2 + " 16:32:22"
		});
		var drug_1 = model.drug().setMaster(masters["アムロジピン"]);
		visit_1_of_patient_1.addDrug(drug_1);
		var drug_2 = model.drug().setMaster(masters["アトルバスタチン"]);
		visit_1_of_patient_2.addDrug(drug_2);
		var drug_3 = model.drug().setMaster(masters["ゾルピデム"]);
		visit_2_of_patient_2.addDrug(drug_3);
		var drug_4 = model.drug().setMaster(masters["アドエア"]);
		visit_2_of_patient_1.addDrug(drug_4);
		conti.exec([
			function(done){
				model.batchSave(conn, [visit_1_of_patient_1, visit_1_of_patient_2,
					visit_2_of_patient_2, visit_2_of_patient_1], done);
			},
			function(done){
				db.searchFullDrugForPatient(conn, patient_1_id, "ア", function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [drug_4, drug_1].map(function(d){ return d.getFullData(); });
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	})
});
