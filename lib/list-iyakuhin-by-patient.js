"use strict";

var db = require("../db");
var conti = require("conti");

exports.listIyakuhinByPatient = function(conn, patientId, cb){
	var codes;
	var list = [];
	conti.exec([
		function(done){
			db.listIyakuhincodesByPatient(conn, patientId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				codes = result;
				done();
			})
		},
		function(done){
			conti.forEach(codes, function(code, done){
				db.getNamesOfIyakuhin(conn, code, function(err, result){
					if( err ){
						done(err);
						return;
					}
					result.iyakuhincode = code;
					list.push(result);
					done();
				})
			}, done);
		}
	], function(err){
		if( err ){
			cb(err);
			return;
		}
        list.sort(function(a, b){
            var va = a.yomi, vb = b.yomi;
            if( va < vb ){
                return -1;
            } else if( va > vb ){
                return 1;
            } else {
                return 0;
            }
        });
		cb(undefined, list);
	})
};