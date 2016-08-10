"use strict";

var setup = require("./setup");
var util = require("./util");
var db = require("../index");
var expect = require("chai").expect;
var conti = require("../lib/conti");

function initDb(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, ["shinryoukoui_master_arch"], ["visit", "visit_shinryou"], done);
	}, done);
}

function DbUtil(conn){
	this.conn = conn;
}

DbUtil.prototype.in_v = function(conn, visits, done){
	conti.forEach(visits, function(visit, done){
		db.insertVisit(conn, visit, done);
	}, done);
};

DbUtil.prototype.in_s = function(conn, shinryouList, done){
	conti.forEach(shinryouList, function(shinryou, done){
		db.insertShinryou(conn, shinryou, done);
	}, done);
};

DbUtil.prototype.in_sm = function(conn, masters, done){
	conti.forEach(masters, function(master, done){
		db.insertShinryouMaster(conn, master, done);
	}, done);
};

describe("Testing getFullShinryou", function(){
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
	})

	//afterEach(initDb);

	it("test no result", function(done){
		db.getFullShinryou(conn, 0, "2016-06-28 10:05:18", function(err){
			expect(err).ok
			done();
		})
	});

	it("test getFullShinryou", function(done){
		var du = new DbUtil(conn);
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var master = util.mockShinryouMaster({
			valid_from: valid_from,
			valid_upto: valid_upto
		});
		var shinryou;
		conti.exec([
			function(done){
				du.in_sm(conn, [master], done);
			},
			function(done){
				shinryou = util.mockShinryou({
					shinryoucode: master.shinryoucode
				});
				du.in_s(conn, [shinryou], done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = util.assign({}, shinryou, master);
			db.getFullShinryou(conn, shinryou.shinryou_id, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(ans);
				done();
			});
		})
	})

	it("test listFullShinryouForVisit", function(done){
		var du = new DbUtil(conn);
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var visit = util.mockVisit({v_datetime: at});
		var masters = util.range(0, 3).map(function(i){
			return util.mockShinryouMaster({
				valid_from: valid_from,
				valid_upto: valid_upto
			});
		});
		var fullShinryouList;
		function makeFull(){
			return masters.map(function(master){
				return {
					shinryou: util.mockShinryou({
						visit_id: visit.visit_id,
						shinryoucode: master.shinryoucode
					}),
					master: master
				}
			});
		}
		conti.exec([
			function(done){
				du.in_v(conn, [visit], done);
			},
			function(done){
				du.in_sm(conn, masters, done);
			},
			function(done){
				fullShinryouList = makeFull();
				var list = fullShinryouList.map(function(item){
					return item.shinryou;
				})
				du.in_s(conn, list, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = fullShinryouList.map(function(item){
				return util.assign({}, item.shinryou, item.master);
			});
			db.listFullShinryouForVisit(conn, visit.visit_id, visit.v_datetime, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(ans);
				done();
			})
		})
	});

	it("test listFullShinryouForVisit (order)", function(done){
		var du = new DbUtil(conn);
		var valid_from = "2016-04-01";
		var at = "2016-06-26 21:35:21";
		var valid_upto = "0000-00-00";
		var visit = util.mockVisit({v_datetime: at});
		var master1 = util.mockShinryouMaster({
			valid_from: valid_from,
			valid_upto: valid_upto,
			shinryoucode: 1
		});
		var master2 = util.mockShinryouMaster({
			valid_from: valid_from,
			valid_upto: valid_upto,
			shinryoucode: 3
		});
		var master3 = util.mockShinryouMaster({
			valid_from: valid_from,
			valid_upto: valid_upto,
			shinryoucode: 2
		});
		var masters = [master1, master2, master3];
		var fullShinryouList;
		function makeFull(){
			return masters.map(function(master){
				return {
					shinryou: util.mockShinryou({
						visit_id: visit.visit_id,
						shinryoucode: master.shinryoucode
					}),
					master: master
				}
			});
		}
		conti.exec([
			function(done){
				du.in_v(conn, [visit], done);
			},
			function(done){
				du.in_sm(conn, masters, done);
			},
			function(done){
				fullShinryouList = makeFull();
				var list = fullShinryouList.map(function(item){
					return item.shinryou;
				})
				du.in_s(conn, list, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ansFullShinryouList = [fullShinryouList[0], fullShinryouList[2], fullShinryouList[1]]
			var ans = ansFullShinryouList.map(function(item){
				return util.assign({}, item.shinryou, item.master);
			});
			db.listFullShinryouForVisit(conn, visit.visit_id, visit.v_datetime, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(ans);
				done();
			})
		})
	});
})