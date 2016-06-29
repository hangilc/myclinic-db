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

function extendShinryou(conn, conduct, at, done){
	db.listFullShinryouForConduct(conn, conduct.id, at, function(err, result){
		if( err ){
			done(err);
			return;
		}
		conduct.shinryou_list = result;
		done();
	})
}

function extendConduct(conn, conduct, at, done){
	conti.exec([
		function(done){ extendLabel(conn, conduct, done); },
		function(done){ extendDrugs(conn, conduct, at, done); },
		function(done){ extendShinryou(conn, conduct, at, done); },
	], done);
}

exports.getFullConduct = function(conn, conductId, at, cb){
	db.getConduct(conn, conductId, function(err, conduct){
		if( err ){
			cb(err);
			return;
		}
		extendConduct(conn, conduct, at, function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, conduct);
		});
	})
}