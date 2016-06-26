"use strict";

exports.deleteUnusedVisitColumn = function(data){
	delete data.jihi;
};

exports.deleteUnusedTextColumn = function(text){
	delete text.pos;
};

