"use strict";

var db = require("../db");
var conti = require("conti");

exports.listFullVisitsByIyakuhincode = function(conn, patientId, iyakuhincode, offset, count, cb){
	var visitIds, visits = [];
	conti.exec([
		function(done){
			db.listVisitIdsByIyakuhincode(conn, patientId, iyakuhincode, offset, count, function(err, result){
				if( err ){
					done(err);
					return;
				}
				visitIds = result;
				done();
			})
		},
		function(done){
			conti.forEach(visitIds, function(visitId, done){
				db.getFullVisit(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					visits.push(result);
					done();
				})
			}, done);
		}
	], function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, visits);
	});
}