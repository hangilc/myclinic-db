"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("conti");
var m = require("./model");

function initDb(done){
	this.timeout(10000);
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["shinryoukoui_master_arch", "iyakuhin_master_arch", "tokuteikizai_master_arch", "visit_gazou_label"],
			["visit_conduct", "visit_conduct_shinryou", "visit_conduct_drug", "visit_conduct_kizai"],
			done);
	}, done);
}

describe("Testing safely delete conduct", function(){
	var conn;

	beforeEach(initDb);

	beforeEach(function(done){
		setup.connect(function(err, conn_){
			if( err ){
				done(err);
				return;
			}
			conn = conn_;
			done();
		})
	});

	afterEach(function(done){
		setup.release(conn, done);
	});

	afterEach(initDb);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("empty", function(done){
		var conduct = m.conduct();
		conti.exec([
			function(done){
				conduct.save(conn, done);
			},
			function(done){
				db.safelyDeleteConduct(conn, conduct.data.id, done);
			}
		], done);
	});

	it("with label", function(done){
		var conduct = m.conduct();
		var conductId;
		conti.exec([
			function(done){
				conduct.save(conn, done);
			},
			function(done){
				conductId = conduct.data.id;
				var label = m.gazouLabel({
					visit_conduct_id: conductId
				});
				label.save(conn, done);
			},
			function(done){
				db.safelyDeleteConduct(conn, conductId, function(err){
					expect(err).ok;
					done();
				})
			}
		], done);
	});

	it("with shinryou", function(done){
		var conduct = m.conduct();
		var conductId;
		conti.exec([
			function(done){
				conduct.save(conn, done);
			},
			function(done){
				conductId = conduct.data.id;
				var shinryou = m.conductShinryou({
					visit_conduct_id: conductId
				});
				shinryou.save(conn, done);
			},
			function(done){
				db.safelyDeleteConduct(conn, conductId, function(err){
					expect(err).ok;
					done();
				})
			}
		], done);
	});

	it("with drug", function(done){
		var conduct = m.conduct();
		var conductId;
		conti.exec([
			function(done){
				conduct.save(conn, done);
			},
			function(done){
				conductId = conduct.data.id;
				var drug = m.conductDrug({
					visit_conduct_id: conductId
				});
				drug.save(conn, done);
			},
			function(done){
				db.safelyDeleteConduct(conn, conductId, function(err){
					expect(err).ok;
					done();
				})
			}
		], done);
	});

	it("with kizai", function(done){
		var conduct = m.conduct();
		var conductId;
		conti.exec([
			function(done){
				conduct.save(conn, done);
			},
			function(done){
				conductId = conduct.data.id;
				var kizai = m.conductKizai({
					visit_conduct_id: conductId
				});
				kizai.save(conn, done);
			},
			function(done){
				db.safelyDeleteConduct(conn, conductId, function(err){
					expect(err).ok;
					done();
				})
			}
		], done);
	});

})
