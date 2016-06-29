"use strict";

var util = require("./util");
var db = require("../index");
var conti = require("../lib/conti");

// ShinryouMaster ////////////////////////////////////////////////////

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

// KizaiMaster ////////////////////////////////////////////////////

function KizaiMaster(props){
	this.data = util.mockKizaiMaster(props);
	this.saved = false;
}

KizaiMaster.prototype.save = function(conn, done){
	if( this.saved ){
		done();
	} else {
		db.insertKizaiMaster(conn, this.data, function(err){
			if( err ){
				done(err);
				return;
			}
			this.saved = true;
			done();
		}.bind(this));
	}
}

exports.kizaiMaster = function(props){
	return new KizaiMaster(props);
}

// ConductShinryou /////////////////////////////////////////////////////////

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

// ConductKizai ///////////////////////////////////////////////////////////

function ConductKizai(props){
	this.data = util.mockConductKizai(props);
	this.saved = false;
}

ConductKizai.prototype.setMaster = function(master){
	this.data.kizaicode = master.data.kizaicode;
	this.master = master;
	return this;
}

ConductKizai.prototype.save = function(conn, done){
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
			db.insertConductKizai(conn, this.data, function(err){
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

ConductKizai.prototype.getFullData = function(){
	if( !this.master ){
		throw new Error("master is not set");
	}
	return util.assign({}, this.data, this.master.data);
}

exports.conductKizai = function(props){
	return new ConductKizai(props);
}

// Conduct ///////////////////////////////////////////////////////////////

function Conduct(props){
	this.data = util.mockConduct(props);
	this.shinryou_list = [];
	this.kizai_list = [];
	this.saved = false;
}

Conduct.prototype.addShinryou = function(shinryou){
	this.shinryou_list.push(shinryou);
};

Conduct.prototype.addKizai = function(kizai){
	this.kizai_list.push(kizai);
}

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
		},
		function(done){
			self.kizai_list.forEach(function(kizai){
				kizai.data.visit_conduct_id = self.data.id;
			});
			conti.forEach(self.kizai_list, function(kizai, done){
				kizai.save(conn, done);
			}, done);
		}
	], done);
};

Conduct.prototype.listFullShinryou = function(){
	return this.shinryou_list.map(function(shinryou){
		return shinryou.getFullData();
	});
};

Conduct.prototype.listFullKizai = function(){
	return this.kizai_list.map(function(kizai){
		return kizai.getFullData();
	});
};

exports.conduct = function(props){
	return new Conduct(props);
}