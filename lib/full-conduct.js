"use strict";

var db = require("../db");
var conti = require("./conti");

function extendLabel(conn, conduct, done){
	db.findGazouLabel(conn, conduct.id, function(err, result){
		if( err ){
			done(err);
			return;
		}
		conduct.gazou_label = result;
		done();
	})
}

function extendDrugs(conn, conduct, at, done){
	db.listFullDrugsForConduct(conn, conduct.id, at, function(err, result){
		if( err ){
			done(err);
			return;
		}
		conduct.drugs = result;
		done();
	})
}

exports.getFullConduct = function(conn, conductId, at, cb){
	var conduct;
	conti.exec([
		function(done){
			db.getConduct(conn, conductId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				conduct = result;
				done();
			})
		},
		function(done){ extendLabel(conn, conduct, done); },
		function(done){ extendDrugs(conn, conduct, at, done); }
	], function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, conduct);
	})
}