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




