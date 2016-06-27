"use strict";

var db = require("../db");
var conti = require("./conti");

function taskExtendText(conn, visit){
	return function(done){
		db.listTextsForVisit(conn, visit.visit_id, function(err, texts){
			if( err ){
				done(err);
				return;
			}
			visit.texts = texts;
			done();
		})
	}
}

function taskExtendShahokokuho(conn, visit){
	return function(done){
		db.getShahokokuho(conn, visit.shahokokuho_id, function(err, result){
			if( err ){
				done(err);
				return;
			}
			visit.shahokokuho = result;
			done();
		})
	};
}

function taskExtendKoukikourei(conn, visit){
	return function(done){
		db.getKoukikourei(conn, visit.koukikourei_id, function(err, result){
			if( err ){
				done(err);
				return;
			}
			visit.koukikourei = result;
			done();
		});
	}
}

function taskExtendRoujin(conn, visit){
	return function(done){
		db.getRoujin(conn, visit.roujin_id, function(err, result){
			if( err ){
				done(err);
				return;
			}
			visit.roujin = result;
			done();
		});
	}
}

function extendKouhi(conn, kouhi_id, list){
	return function(done){
		db.getKouhi(conn, kouhi_id, function(err, result){
			if( err ){
				done(err);
				return;
			}
			list.push(result);
			done();
		})
	}
}

function taskExtendHoken(conn, visit){
	var funs = [];
	if( visit.shahokokuho_id > 0 ){
		funs.push(taskExtendShahokokuho(conn, visit));
	} else {
		visit.shahokokuho = null;
	}
	if( visit.koukikourei_id > 0 ){
		funs.push(taskExtendKoukikourei(conn, visit));
	} else {
		visit.koukikourei = null;
	}
	if( visit.roujin_id > 0 ){
		funs.push(taskExtendRoujin(conn, visit));
	} else {
		visit.roujin = null;
	}
	visit.kouhi_list = [];
	[1,2,3].forEach(function(i){
		var key = "kouhi_" + i + "_id";
		if( visit[key] > 0 ){
			funs.push(extendKouhi(conn, visit[key], visit.kouhi_list));
		}
	});
	return function(done){
		conti.exec(funs, done);
	}
}

function taskExtendDrug(conn, visit){
	return function(done){
		db.listFullDrugsForVisit(conn, visit.visit_id, visit.v_datetime, function(err, result){
			if( err ){
				done(err);
				return;
			}
			visit.drugs = result;
			done();
		})
	}
}

exports.extendVisit = function(conn, visit, done){
	conti.exec([
		taskExtendText(conn, visit),
		taskExtendHoken(conn, visit),
		taskExtendDrug(conn, visit)
	], done);
};

exports.getFullVisit = function(conn, visitId, cb){
	db.getVisit(conn, visitId, function(err, visit){
		if( err ){
			cb(err);
			return;
		}
		exports.extendVisit(conn, visit, function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, visit);
		});
	})
};