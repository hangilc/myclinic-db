"use strict";

var db = require("../db");

exports.extendVisit = function(conn, visit, done){
	visit.hello = "world";
	done();
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