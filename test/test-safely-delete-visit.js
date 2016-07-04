"use strict";

var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var DbUtil = require("./db-util");
var util = require("./util");
var conti = require("../lib/conti");
var m = require("./model");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, 
			["wqueue", "pharma_queue"],
			["visit_conduct", "visit_drug", "visit_shinryou", "visit_text", "visit"],
			done);
	}, done);
}

describe("Testing safely delete visit", function(){
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

	it("minimal", function(done){
		var visit = m.visit();
		var visitId;
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				visitId = visit.data.visit_id;
				db.safelyDeleteVisit(conn, visitId, done);
			},
			function(done){
				db.findVisit(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).null;
					done();
				})
			}
		], done);
	});

	it("confirm pharma queue is also deleted", function(done){
		var visit = m.visit();
		var visitId;
		var pq;
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				visitId = visit.data.visit_id;
				pq = m.pharmaQueue({visit_id: visitId});
				pq.save(conn, done);
			},
			function(done){
				db.safelyDeleteVisit(conn, visitId, done);
			},
			function(done){
				db.findPharmaQueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).null;
					done();
				})
			}
		], done);
	});

	it("confirm wqueue is also deleted", function(done){
		var visit = m.visit();
		var visitId;
		var wq;
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				visitId = visit.data.visit_id;
				wq = m.wqueue({visit_id: visitId});
				wq.save(conn, done);
			},
			function(done){
				db.safelyDeleteVisit(conn, visitId, done);
			},
			function(done){
				db.findWqueue(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).null;
					done();
				})
			}
		], done);
	});

	it("confirm fail if text exists", function(done){
		var visit = m.visit();
		var visitId;
		var text;
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				visitId = visit.data.visit_id;
				text = m.text({visit_id: visitId});
				text.save(conn, done);
			},
			function(done){
				db.safelyDeleteVisit(conn, visitId, function(err){
					expect(err).ok;
					done();
				});
			}
		], done);
	})

	it("confirm fail if drug exists", function(done){
		var visit = m.visit();
		var visitId;
		var drug;
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				visitId = visit.data.visit_id;
				drug = m.drug({visit_id: visitId});
				drug.save(conn, done);
			},
			function(done){
				db.safelyDeleteVisit(conn, visitId, function(err){
					expect(err).ok;
					done();
				});
			}
		], done);
	})

	it("confirm fail if shinryou exists", function(done){
		var visit = m.visit();
		var visitId;
		var shinryou;
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				visitId = visit.data.visit_id;
				shinryou = m.shinryou({visit_id: visitId});
				shinryou.save(conn, done);
			},
			function(done){
				db.safelyDeleteVisit(conn, visitId, function(err){
					expect(err).ok;
					done();
				});
			}
		], done);
	})

	it("confirm fail if conduct exists", function(done){
		var visit = m.visit();
		var visitId;
		var conduct;
		conti.exec([
			function(done){
				visit.save(conn, done);
			},
			function(done){
				visitId = visit.data.visit_id;
				conduct = m.conduct({visit_id: visitId});
				conduct.save(conn, done);
			},
			function(done){
				db.safelyDeleteVisit(conn, visitId, function(err){
					expect(err).ok;
					done();
				});
			}
		], done);
	})

})
