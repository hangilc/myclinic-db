"use strict";

var db = require("../db");
var conti = require("conti");
var fullConduct = require("./full-conduct");

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

function taskExtendShinryou(conn, visit){
	return function(done){
		db.listFullShinryouForVisit(conn, visit.visit_id, visit.v_datetime, function(err, result){
			if( err ){
				done(err);
				return;
			}
			visit.shinryou_list = result;
			done();
		})
	}
}

function taskExtendConducts(conn, visit){
	return function(done){
		db.listFullConductsForVisit(conn, visit.visit_id, visit.v_datetime, function(err, result){
			if( err ){
				done(err);
				return;
			}
			visit.conducts = result;
			done();
		})
	}
}

function taskExtendCharge(conn, visit){
	return function(done){
		db.findCharge(conn, visit.visit_id, function(err, result){
			if( err ){
				done(err);
				return;
			}
			visit.charge = result;
			done();
		})
	}
}

function extendVisit(conn, visit, done){
	conti.exec([
		taskExtendText(conn, visit),
		taskExtendHoken(conn, visit),
		taskExtendDrug(conn, visit),
		taskExtendShinryou(conn, visit),
		taskExtendConducts(conn, visit),
		taskExtendCharge(conn, visit)
	], done);
};

function extendVisitWithHoken(conn, visit, done){
	conti.exec([
		taskExtendHoken(conn, visit),
	], done);
};

exports.getFullVisit = function(conn, visitId, cb){
	db.getVisit(conn, visitId, function(err, visit){
		if( err ){
			cb(err);
			return;
		}
		extendVisit(conn, visit, function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, visit);
		});
	})
};

exports.getVisitWithFullHoken = function(conn, visitId, cb){
	db.getVisit(conn, visitId, function(err, visit){
		if( err ){
			cb(err);
			return;
		}
		extendVisitWithHoken(conn, visit, function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, visit);
		});
	})
}

exports.listFullVisitsForPatient = function(conn, patientId, offset, n, cb){
	db.listVisitsForPatient(conn, patientId, offset, n, function(err, visits){
		if( err ){
			cb(err);
			return;
		}
		conti.forEach(visits, function(visit, done){
			extendVisit(conn, visit, done);
		}, function(err){
			if( err ){
				done(err);
				return;
			}
			cb(undefined, visits);
		});
	});
};