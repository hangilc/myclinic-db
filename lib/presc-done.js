"use strict";

var db = require("../db");
var conti = require("conti");

exports.prescDone = function(conn, visitId, done){
	var drugs;
	conti.exec([
		function(done){
			db.listDrugsForVisit(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				drugs = result;
				done();
			})
		},
		function(done){
			conti.forEachPara(drugs, function(drug, done){
				drug.d_prescribed = 1;
				db.updateDrug(conn, drug, done);
			}, done);
		},
		function(done){
			db.tryDeletePharmaQueue(conn, visitId, done);
		},
		function(done){
			db.tryDeleteWqueue(conn, visitId, done);
		}
	], done);
};