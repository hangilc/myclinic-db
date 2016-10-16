"use strict";

exports.deleteUnusedVisitColumn = function(data){
	delete data.jihi;
};

exports.deleteUnusedTextColumn = function(text){
	delete text.pos;
};

exports.deleteUnusedShahokokuhoColumn = function(shahokokuho){
	delete shahokokuho.active;
}

exports.deleteUnusedRoujinColumn = function(roujin){
	delete roujin.active;
}

exports.deleteUnusedKouhiColumn = function(kouhi){
	delete kouhi.active;
	delete kouhi.category;
}

exports.deleteUnusedDrugColumn = function(data){
	delete data.d_pos;
	delete data.d_shuukeisaki;
}

exports.deleteUnusedIyakuhinMasterColumn = function(data){
	delete data.yakkacode;
}

exports.deleteUnusedChargeColumn = function(data){
	delete data.jindouteki_mishuu;
	delete data.inchou_kessai;
}

exports.deleteUnusedPrescExampleColumn = function(data){
	delete data.m_group;
}

/***
exports.momentToSqlDateTime = function(m){
	return m.format("YYYY-MM-DD HH:mm:ss");
}

exports.momentToSqlDate = function(m){
	return m.format("YYYY-MM-DD");
}
***/

var uConst = require("myclinic-consts");
Object.keys(uConst).forEach(function(key){
	exports[key] = uConst[key];
});



