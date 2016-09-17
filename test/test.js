"use strict";

var setup = require("./setup");
var util = require("./util");

var allTables = ["disease", "disease_adj", "hoken_koukikourei", "hoken_roujin", "hoken_shahokokuho",
	"hotline", "iyakuhin_master_arch", "kouhi", "patient", "pharma_drug", "pharma_queue", "presc_example",
	"shinryoukoui_master_arch", "shoubyoumei_master_arch", "shuushokugo_master", "stock_drug",
	"tokuteikizai_master_arch", "visit", "visit_charge", "visit_conduct", "visit_conduct_drug",
	"visit_conduct_kizai", "visit_conduct_shinryou", "visit_drug", "visit_gazou_label",
	"visit_payment", "visit_shinryou", "visit_text", "wqueue"];

after(function(done){
	var conn = setup.getConnection();
	util.clearTables(conn, allTables, function(err){
		if( err ){
			console.log(err);
			return;
		}
		console.log("All tables cleared.");
		done();
	});
});