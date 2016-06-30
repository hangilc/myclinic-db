"use strict";

var db = require("../db");
var conti = require("./conti");
var host = require("./host");
var moment = require("moment");
var util = rquire("./util");

exports.startVisit = function(conn, patientId, at, cb){
	var visit = {
		patient_id: patientId,
		v_datetime: util.momentToSqlDateTime(moment()),
		shahokokuho_id: 0,
		koukikourei_id: 0,
		roujin_id: 0,
		kouhi_1_id: 0,
		kouhi_2_id: 0,
		kouhi_3_id: 0
	};
	conti.exec([
		function(done){
			host.listAvailableHoken(conn, patientId, visit.v_datetime, function(err, result){
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
				wait_state: util.wqueueStateWaitExam
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