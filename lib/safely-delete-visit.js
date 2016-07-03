"use strict";

var db = require("../db");
var conti = require("./conti");

exports.safelyDeleteVisit = function(conn, visitId, done){
	conti.exec([
		function(done){
			done("Not implemented");
		}
	], done);
};