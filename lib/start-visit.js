"use strict";

var db = require("../db");
var conti = require("conti");
var hoken = require("./hoken");
var util = require("./util");
//var moment = require("moment");

exports.startVisit = function(conn, patientId, at, cb){
	var visit = {
		patient_id: patientId,
		v_datetime: at,
		shahokokuho_id: 0,
		koukikourei_id: 0,
		roujin_id: 0,
		kouhi_1_id: 0,
		kouhi_2_id: 0,
		kouhi_3_id: 0
	};
	conti.exec([
		function(done){
			hoken.listAvailableHoken(conn, patientId, visit.v_datetime, function(err, result){
				if( err ){
					done(err);
					return;
				}
				if( result.shahokokuho_list.length > 0 ){
					visit.shahokokuho_id = result.shahokokuho_list[0].shahokokuho_id;
				}
				if( result.koukikourei_list.length > 0 ){
					visit.koukikourei_id = result.koukikourei_list[0].koukikourei_id;
				}
				if( result.roujin_list.length > 0 ){
					visit.roujin_id = result.roujin_list[0].roujin_id;
				}
				if( result.kouhi_list.length >= 1 ){
					visit.kouhi_1_id = result.kouhi_list[0].kouhi_id;
				}
				if( result.kouhi_list.length >= 2 ){
					visit.kouhi_2_id = result.kouhi_list[1].kouhi_id;
				}
				if( result.kouhi_list.length >= 3 ){
					visit.kouhi_3_id = result.kouhi_list[2].kouhi_id;
				}
				db.insertVisit(conn, visit, done);
			})
		}, 
		function(done){
			var wqueue = {
				visit_id: visit.visit_id,
				wait_state: util.WqueueStateWaitExam
			};
			db.insertWqueue(conn, wqueue, done);
		}
	], function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, visit.visit_id);
	})
};

exports.startExam = function(conn, visitId, done){
	var sql = "update wqueue set wait_state = ? where visit_id = ?";
	var args = [util.WqueueStateInExam, visitId];
	conn.query(sql, args, done);
};

exports.suspendExam = function(conn, visitId, done){
    var sql = "update wqueue set wait_state = ? where visit_id = ?";
    var args = [util.WqueueStateWaitReExam, visitId];
    conn.query(sql, args, done);
}

exports.endExam = function(conn, visitId, charge, done){
	var currentWqueue;
	var isToday;
	conti.exec([
		function(done){
			db.setChargeValue(conn, visitId, charge, done);
		},
		function(done){
			db.findWqueue(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				currentWqueue = result;
				done();
			})
		},
		function(done){
			var wq = {
				visit_id: visitId,
				wait_state: util.WqueueStateWaitCashier
			}
			if( currentWqueue ){
				db.updateWqueue(conn, wq, done);
			} else {
				db.insertWqueue(conn, wq, done);
			}
		},
		function(done){
			db.tryDeletePharmaQueue(conn, visitId, done);
		},
		function(done){
			// var today = moment().format("YYYY-MM-DD");
			var today = new Date().toLocaleDateString();
			db.getVisit(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				isToday = result.v_datetime.slice(0, 10) === today;
				done();
			});
		},
		function(done){
			if( !isToday ){
				done();
				return;
			}
			db.countUnprescribedDrugsForVisit(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				if( result > 0 ){
					db.insertPharmaQueue(conn, {
						visit_id: visitId,
						pharma_state: util.PharmaQueueStateWaitPack
					}, done);
				} else {
					done();
				}
			})
		}
	], done);
}
