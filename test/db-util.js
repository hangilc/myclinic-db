"use strict";

var conti = require("../lib/conti");
var db = require("../index");

function DbUtil(conn){
	this.conn = conn;
}

DbUtil.prototype.in_v = function(visits, done){
	var conn = this.conn;
	conti.forEach(visits, function(visit, done){
		db.insertVisit(conn, visit, done);
	}, done);
};

DbUtil.prototype.in_s = function(shinryouList, done){
	var conn = this.conn;
	conti.forEach(shinryouList, function(shinryou, done){
		db.insertShinryou(conn, shinryou, done);
	}, done);
};

DbUtil.prototype.in_sm = function(masters, done){
	var conn = this.conn;
	conti.forEach(masters, function(master, done){
		db.insertShinryouMaster(conn, master, done);
	}, done);
};

DbUtil.prototype.t_in_im = function(masters){
	var conn = this.conn;
	return conti.taskForEach(masters, function(master, done){
		db.insertIyakuhinMaster(conn, master, done);
	});
};

DbUtil.prototype.in_c = function(conducts, done){
	var conn = this.conn;
	conti.forEach(conducts, function(conduct, done){
		db.insertConduct(conn, conduct, done);
	}, done)
};

DbUtil.prototype.t_in_c = function(conducts){
	var conn = this.conn;
	return conti.taskForEach(conducts, function(conduct, done){
		db.insertConduct(conn, conduct, done);
	})
};

DbUtil.prototype.in_cd = function(drugs, done){
	var conn = this.conn;
	conti.forEach(drugs, function(drug, done){
		db.insertConductDrug(conn, drug, done);
	}, done);
};

module.exports = DbUtil;