"use strict";

var db = require("../db");
var conti = require("./conti");

exports.safelyDeleteVisit = function(conn, visitId, done){
	conti.exec([
		function(done){
			db.countTextsForVisit(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				if( result > 0 ){
					done("文章入力があるので診察を削除できません。");
					return;
				}
				done();
			})
		},
		function(done){
			db.countDrugsForVisit(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				if( result > 0 ){
					done("処方があるので診察を削除できません。");
					return;
				}
				done();
			})
		},
		function(done){
			db.countShinryouForVisit(conn, visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				if( result > 0 ){
					done("診療行為があるので診察を削除できません。");
					return;
				}
				done();
			})
		}
	], done);
};