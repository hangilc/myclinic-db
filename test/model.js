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

// Text ////////////////////////////////////////////////////////////////////

function Text(props){
	this.data = util.mockText(props);
	this.saved = false;
}

Text.prototype.save = function(conn, done){
	if( this.saved ){
		setImmediate(done);
		return;
	}
	var self = this;
	db.insertText(conn, self.data, function(err){
		if( err ){
			done(err);
			return;
		}
		self.saved = true;
		done();
	});
};

exports.text = function(props){
	return new Text(props);
}

// Shahokokuho /////////////////////////////////////////////////////////////

function Shahokokuho(props){
	this.data = util.mockShahokokuho(props);
	this.saved = false;
}

Shahokokuho.prototype.save = function(conn, done){
	if( this.saved ){
		setImmediate(done);
		return;
	}
	var self = this;
	db.insertShahokokuho(conn, self.data, function(err){
		if( err ){
			done(err);
			return;
		}
		self.saved = true;
		done();
	})
}

exports.shahokokuho = function(props){
	return new Shahokokuho(props);
}

// Koukikourei /////////////////////////////////////////////////////////////

function Koukikourei(props){
	this.data = util.mockKoukikourei(props);
	this.saved = false;
}

Koukikourei.prototype.save = function(conn, done){
	if( this.saved ){
		setImmediate(done);
		return;
	}
	var self = this;
	db.insertKoukikourei(conn, self.data, function(err){
		if( err ){
			done(err);
			return;
		}
		self.saved = true;
		done();
	})
}

exports.koukikourei = function(props){
	return new Koukikourei(props);
}

// Roujin /////////////////////////////////////////////////////////////

function Roujin(props){
	this.data = util.mockRoujin(props);
	this.saved = false;
}

Roujin.prototype.save = function(conn, done){
	if( this.saved ){
		setImmediate(done);
		return;
	}
	var self = this;
	db.insertRoujin(conn, self.data, function(err){
		if( err ){
			done(err);
			return;
		}
		self.saved = true;
		done();
	})
}

exports.roujin = function(props){
	return new Roujin(props);
}

// Kouhi /////////////////////////////////////////////////////////////

function Kouhi(props){
	this.data = util.mockKouhi(props);
	this.saved = false;
}

Kouhi.prototype.save = function(conn, done){
	if( this.saved ){
		setImmediate(done);
		return;
	}
	var self = this;
	db.insertKouhi(conn, self.data, function(err){
		if( err ){
			done(err);
			return;
		}
		self.saved = true;
		done();
	})
}

exports.kouhi = function(props){
	return new Kouhi(props);
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

// Visit ///////////////////////////////////////////////////////////////////

function Visit(props){
	props = util.assign({}, {
		patient_id: 0,
		v_datetime: "2016-06-22 11:51:03", 
		shahokokuho_id: 0, 
		koukikourei_id: 0, 
		roujin_id: 0, 
		kouhi_1_id: 0, 
		kouhi_2_id: 0, 
		kouhi_3_id: 0
	}, props);
	this.data = util.mockVisit(props);
	this.saved = false;
	this.texts = [];
	this.shahokokuho = null;
	this.koukikourei = null;
	this.roujin = null;
	this.kouhiList = [];
	this.drugs = [];
	this.shinryouList = [];
	this.conducts = [];
	this.charge = null;
}

Visit.prototype.addText = function(text){
	this.texts.push(text);
};

Visit.prototype.setShahokokuho = function(shahokokuho){
	this.shahokokuho = shahokokuho;
};

Visit.prototype.setKoukikourei = function(koukikourei){
	this.koukikourei = koukikourei;
};

Visit.prototype.setRoujin = function(roujin){
	this.roujin = roujin;
};

Visit.prototype.addKouhi = function(kouhi){
	if( this.kouhiList.length < 3 ){
		this.kouhiList.push(kouhi);
	} else {
		console.warn("more than 3 kouhi (neglected)");
	}
}

Visit.prototype.save = function(conn, done){
	var self = this;
	conti.exec([
		function(done){
			if( self.shahokokuho ){
				self.shahokokuho.save(conn, function(err){
					if( err ){
						done(err);
						return;
					}
					self.data.shahokokuho_id = self.shahokokuho.data.shahokokuho_id;
					done();
				})
			} else {
				setImmediate(done);
			}
		},
		function(done){
			if( self.koukikourei ){
				self.koukikourei.save(conn, function(err){
					if( err ){
						done(err);
						return;
					}
					self.data.koukikourei_id = self.koukikourei.data.koukikourei_id;
					done();
				})
			} else {
				setImmediate(done);
			}
		},
		function(done){
			conti.forEach(self.kouhiList, function(kouhi, done){
				kouhi.save(conn, done);
			}, function(err){
				if( err ){
					done(err);
					return;
				}
				self.data.kouhi_1_id = 0;
				self.data.kouhi_2_id = 0;
				self.data.kouhi_3_id = 0;
				if( self.kouhiList.length >= 1 ){
					self.data.kouhi_1_id = self.kouhiList[0].data.kouhi_id;
				}
				if( self.kouhiList.length >= 2 ){
					self.data.kouhi_2_id = self.kouhiList[1].data.kouhi_id;
				}
				if( self.kouhiList.length >= 3 ){
					self.data.kouhi_3_id = self.kouhiList[2].data.kouhi_id;
				}
				done();
			});
		},
		function(done){
			if( self.roujin ){
				self.roujin.save(conn, function(err){
					if( err ){
						done(err);
						return;
					}
					self.data.roujin_id = self.roujin.data.roujin_id;
					done();
				})
			} else {
				setImmediate(done);
			}
		},
		function(done){
			db.insertVisit(conn, self.data, function(err){
				if( err ){
					done(err);
					return;
				}
				self.saved = true;
				done();
			})
		},
		function(done){
			conti.forEach(self.texts, function(text, done){
				if( !text.saved ){
					text.visit_id = self.data.visit_id;
				}
				text.save(conn, done);
			}, done);
		}
	], done);
}

Visit.prototype.getFullData = function(){
	return util.assign({}, this.data, {
		texts: util.pluck(this.texts, "data"),
		shahokokuho: this.shahokokuho ? this.shahokokuho.data : null,
		koukikourei: this.koukikourei ? this.koukikourei.data : null,
		roujin: this.roujin ? this.roujin.data : null,
		kouhi_list: util.pluck(this.kouhiList, "data"),
		drugs: this.drugs.map(function(drug){ return drug.getFullData(); }),
		shinryou_list: this.shinryouList.map(function(shinryou){ return shinryou.getFullData(); }),
		conducts: this.conducts.map(function(conduct){ return conduct.getFullData(); }),
		charge: this.charge ? this.charge.data : null
	});
}

exports.visit = function(props){
	return new Visit(props);
}

// batchSave ///////////////////////////////////////////////////////////////

exports.batchSave = function(conn, models, done){
	conti.forEach(models, function(model, done){
		model.save(conn, done);
	}, done);
}