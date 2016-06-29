"use strict";

var util = require("./util");
var db = require("../index");
var conti = require("../lib/conti");

function ShinryouMaster(props){
	this.data = util.mockShinryouMaster(props);
	this.saved = false;
}

ShinryouMaster.prototype.save = function(conn, done){
	if( this.saved ){
		done();
	} else {
		db.insertShinryouMaster(conn, this.data, function(err){
			if( err ){
				done(err);
				return;
			}
			this.saved = true;
			done();
		}.bind(this));
	}
}

exports.shinryouMaster = function(props){
	return new ShinryouMaster(props);
}

function ConductShinryou(props){
	this.data = util.mockConductShinryou(props);
	this.saved = false;
}

ConductShinryou.prototype.setMaster = function(master){
	this.data.shinryoucode = master.data.shinryoucode;
	this.master = master;
	return this;
};

ConductShinryou.prototype.save = function(conn, done){
	if( this.saved ){
		done();
		return;
	}
	conti.exec([
		function(done){
			if( this.master ){
				this.master.save(conn, done);
			} else {
				done();
			}
		}.bind(this),
		function(done){
			db.insertConductShinryou(conn, this.data, function(err){
				if( err ){
					done(err);
					return;
				}
				this.saved = true;
				done();
			}.bind(this))
		}.bind(this)
	], done);
};

ConductShinryou.prototype.getFullData = function(){
	if( !this.master ){
		throw new Error("master is not set");
	}
	return util.assign({}, this.data, this.master.data);
}

exports.conductShinryou = function(props){
	return new ConductShinryou(props);
}

function Conduct(props){
	this.data = util.mockConduct(props);
	this.shinryou_list = [];
	this.saved = false;
}

Conduct.prototype.addShinryou = function(shinryou){
	this.shinryou_list.push(shinryou);
};

Conduct.prototype.save = function(conn, done){
	if( this.saved ){
		done();
		return;
	}
	var self = this;
	conti.exec([
		function(done){
			db.insertConduct(conn, self.data, function(err){
				if( err ){
					done(err);
					return;
				}
				self.saved = true;
				done();
			});
		},
		function(done){
			self.shinryou_list.forEach(function(shinryou){
				shinryou.data.visit_conduct_id = self.data.id;
			});
			conti.forEach(self.shinryou_list, function(shinryou, done){
				shinryou.save(conn, done);
			}, done);
		}
	], done);
};

exports.conduct = function(props){
	return new Conduct(props);
}