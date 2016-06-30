"use strict";

var db = require("../db");
var conti = require("./conti");

exports.listAvailableHoken = function(conn, patientId, at, cb){
	var hoken = {};

	conti.exec([
		function(done){
			db.listAvailableShahokokuho(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				hoken.shahokokuho_list = result;
				done();
			})
		},
		function(done){
			db.listAvailableKoukikourei(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				hoken.koukikourei_list = result;
				done();
			})
		},
		function(done){
			db.listAvailableRoujin(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				hoken.roujin_list = result;
				done();
			})
		},
		function(done){
			db.listAvailableKouhi(conn, patientId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				hoken.kouhi_list = result;
				done();
			})
		}
	], function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, hoken);
	})
}