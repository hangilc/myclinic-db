"use strict";

var db = require("../db");
var conti = require("../lib/conti");

exports.safelyDeleteConduct = function(conn, conductId, done){
	conti.exec([
		function(done){
			db.findGazouLabel(conn, conductId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				if( result !== null ){
					done("画像ラベルがあるので処置を削除できません。");
					return;
				}
				done();
			})
		},
		function(done){
			db.countConductShinryouForConduct(conn, conductId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				if( result > 0 ){
					done("診療行為があるので処置を削除できません。");
					return;
				}
				done();
			})
		},
		function(done){
			db.countConductDrugsForConduct(conn, conductId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				if( result > 0 ){
					done("薬剤があるので処置を削除できません。");
					return;
				}
				done();
			})
		},
		function(done){
			db.countConductKizaiForConduct(conn, conductId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				if( result > 0 ){
					done("器材があるので処置を削除できません。");
					return;
				}
				done();
			})
		},
		function(done){
			db.deleteConduct(conn, conductId, done);
		}
	], done);
};