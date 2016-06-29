"use strict";

var util = require("./util");
var db = require("../index");
var conti = require("../lib/conti");

// IyakuhinMaster ////////////////////////////////////////////////////

function IyakuhinMaster(props){
	this.data = util.mockIyakuhinMaster(props);
	this.saved = false;
}

IyakuhinMaster.prototype.save = function(conn, done){
	if( this.saved ){
		done();
	} else {
		db.insertIyakuhinMaster(conn, this.data, function(err){
			if( err ){
				done(err);
				return;
			}
			this.saved = true;
			done();
		}.bind(this));
	}
}

exports.iyakuhinMaster = function(props){
	return new IyakuhinMaster(props);
}

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

// GazouLabel //////////////////////////////////////////////////////////////

function GazouLabel(props){
	this.data = util.mockGazouLabel(props);
	this.saved = false;
}

GazouLabel.prototype.save = function(conn, done){
	if( this.saved ){
		setImmediate(function(){
			done();
		});
		return;
	}
	var self = this;
	db.insertGazouLabel(conn, self.data, function(err){
		if( err ){
			done(err);
			return;
		}
		self.saved = true;
		done();
	})
};

exports.gazouLabel = function(props){
	return new GazouLabel(props);
}

// ConductDrug /////////////////////////////////////////////////////////////

function ConductDrug(props){
	this.data = util.mockConductDrug(props);
	this.saved = false;
}

ConductDrug.prototype.setMaster = function(master){
	this.data.iyakuhincode = master.data.iyakuhincode;
	this.master = master;
	return this;
};

ConductDrug.prototype.save = function(conn, done){
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
			db.insertConductDrug(conn, this.data, function(err){
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

ConductDrug.prototype.getFullData = function(){
	if( !this.master ){
		throw new Error("master is not set");
	}
	return util.assign({}, this.data, this.master.data);
}

exports.conductDrug = function(props){
	return new ConductDrug(props);
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
	this.gazouLabel = null;
	this.drugs = [];
	this.shinryouList = [];
	this.kizaiList = [];
	this.saved = false;
}

Conduct.prototype.setGazouLabel = function(gazouLabel){
	this.gazouLabel = gazouLabel;
};

Conduct.prototype.addDrug = function(drug){
	this.drugs.push(drug);
};

Conduct.prototype.addShinryou = function(shinryou){
	this.shinryouList.push(shinryou);
};

Conduct.prototype.addKizai = function(kizai){
	this.kizaiList.push(kizai);
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
			if( self.gazouLabel ){
				self.gazouLabel.data.visit_conduct_id = self.data.id;
				self.gazouLabel.save(conn, done);
			} else {
				setImmediate(done);
			}
		},
		function(done){
			self.drugs.forEach(function(drug){
				drug.data.visit_conduct_id = self.data.id;
			});
			conti.forEach(self.drugs, function(drug, done){
				drug.save(conn, done);
			}, done);
		},
		function(done){
			self.shinryouList.forEach(function(shinryou){
				shinryou.data.visit_conduct_id = self.data.id;
			});
			conti.forEach(self.shinryouList, function(shinryou, done){
				shinryou.save(conn, done);
			}, done);
		},
		function(done){
			self.kizaiList.forEach(function(kizai){
				kizai.data.visit_conduct_id = self.data.id;
			});
			conti.forEach(self.kizaiList, function(kizai, done){
				kizai.save(conn, done);
			}, done);
		}
	], done);
};

Conduct.prototype.listFullDrugs = function(){
	return this.drugs.map(function(drug){
		return drug.getFullData();
	});
}

Conduct.prototype.listFullShinryou = function(){
	return this.shinryouList.map(function(shinryou){
		return shinryou.getFullData();
	});
};

Conduct.prototype.listFullKizai = function(){
	return this.kizaiList.map(function(kizai){
		return kizai.getFullData();
	});
};

Conduct.prototype.getFullData = function(){
	var self = this;
	return util.assign({}, self.data, {
		gazou_label: self.gazouLabel ? self.gazouLabel.data.label : "",
		drugs: self.listFullDrugs(),
		shinryou_list: self.listFullShinryou(),
		kizai_list: self.listFullKizai()
	});
}

exports.conduct = function(props){
	return new Conduct(props);
}