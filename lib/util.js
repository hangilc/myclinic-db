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






