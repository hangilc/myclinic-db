var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var moment = require("moment");
var model = require("./model");
var conti = require("conti");

var clearTable = util.createClearTableFun("iyakuhin_master_arch");

describe("Testing iyakuhin master", function(){
	before(clearTable);
	after(clearTable);

	var conn = setup.getConnection();

	it("insert", function(done){
		var master = util.mockIyakuhinMaster();
		db.insertIyakuhinMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			done();
		})
	});
	it("get (no limit)", function(done){
		var master = util.mockIyakuhinMaster();
		master.valid_upto = "0000-00-00";
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertIyakuhinMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getIyakuhinMaster(conn, master.iyakuhincode, at, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(master);
				done();
			})
		})
	});
	it("get (with limit)", function(done){
		var master = util.mockIyakuhinMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertIyakuhinMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getIyakuhinMaster(conn, master.iyakuhincode, at, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(master);
				done();
			})
		})
	});
	it("find (no limit)", function(done){
		var master = util.mockIyakuhinMaster();
		master.valid_upto = "0000-00-00";
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertIyakuhinMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findIyakuhinMaster(conn, master.iyakuhincode, at, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(master);
				done();
			})
		})
	});
	it("find (with limit)", function(done){
		var master = util.mockIyakuhinMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertIyakuhinMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findIyakuhinMaster(conn, master.iyakuhincode, at, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).eql(master);
				done();
			})
		})
	});
	it("find (no limit, fail)", function(done){
		var master = util.mockIyakuhinMaster();
		master.valid_upto = "0000-00-00";
		var at = moment(master.valid_from).add(-1, "month").format("YYYY-MM-DD");
		db.insertIyakuhinMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findIyakuhinMaster(conn, master.iyakuhincode, at, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).not.ok;
				done();
			})
		})
	});
	it("find (with limit, fail)", function(done){
		var master = util.mockIyakuhinMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_upto).add(1, "day").format("YYYY-MM-DD");
		db.insertIyakuhinMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findIyakuhinMaster(conn, master.iyakuhincode, at, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).not.ok;
				done();
			})
		})
	});
	it("find (with limit, datetime)", function(done){
		var master = util.mockIyakuhinMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_upto).add(1, "hour").format("YYYY-MM-DD HH:mm:ss");
		db.insertIyakuhinMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findIyakuhinMaster(conn, master.iyakuhincode, at, function(err, row){
				if( err ){
					done(err);
					return;
				}
				expect(row).ok;
				done();
			})
		})
	});
});

describe("Testing search iyakuhin master", function(){
	var conn = setup.getConnection();
	beforeEach(clearTable);
	afterEach(clearTable);

	var valid_from = "2016-04-01";
	var at = "2016-06-26 21:35:21";
	var valid_upto = "2018-03-31";
	var valid_upto_no_limit = "0000-00-00";

	it("empty", function(done){
		db.searchIyakuhinMaster(conn, "テスト", at, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	function makeMasters(names, valid_from, valid_upto){
		return names.map(function(name){
			return model.iyakuhinMaster({
				name: name,
				valid_from: valid_from,
				valid_upto: valid_upto
			})
		});
	}

	it("case 1", function(done){
		var masters = makeMasters(["あいう", "かきく", "さしす"], valid_from, valid_upto);
		conti.exec([
			function(done){
				model.batchSave(conn, masters, done);
			},
			function(done){
				db.searchIyakuhinMaster(conn, "き", at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(util.pluck(result, "name")).eql(["かきく"]);
					done();
				})
			}
		], done);
	});

	it("case 2", function(done){
		var masters = makeMasters(["あいう", "かきく", "さしす", "たきつ"], valid_from, valid_upto);
		conti.exec([
			function(done){
				model.batchSave(conn, masters, done);
			},
			function(done){
				db.searchIyakuhinMaster(conn, "き", at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(util.pluck(result, "name")).eql(["かきく", "たきつ"]);
					done();
				})
			}
		], done);
	});

	it("case 3", function(done){
		var masters = makeMasters(["あいう", "かきく", "さしす", "たきつ"], valid_from, valid_upto);
		var masters2 = makeMasters(["あいう", "かきく", "さしす", "たきつ"], 
			util.incDay(valid_upto, 1),
			util.incDay(valid_upto, 365));
		conti.exec([
			function(done){
				model.batchSave(conn, [].concat(masters, masters2), done);
			},
			function(done){
				db.searchIyakuhinMaster(conn, "き", at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(util.pluck(result, "name")).eql(["かきく", "たきつ"]);
					var atDate = util.sqlDatePart(at);
					expect(result.every(function(r){
						return r.valid_from <= atDate && atDate <= r.valid_upto;
					})).ok;
					done();
				})
			}
		], done);
	})
});

describe("Testing getNamesOfIyakuhin", function(){
	var conn = setup.getConnection();

	beforeEach(function(done){
		util.clearTables(conn, ["iyakuhin_master_arch"], done);
	});

	it("simple", function(done){
		var masters = [
			{ iyakuhincode: 1234, name: "アムロジン", yomi: "ｱﾑﾛｼﾞﾝ", valid_from: "2014-04-01" },
			{ iyakuhincode: 1823, name: "フリバス", yomi: "ﾌﾘﾊﾞｽ", valid_from: "2014-04-01" },
			{ iyakuhincode: 1234, name: "アムロジン錠", yomi: "ｱﾑﾛｼﾞﾝ", valid_from: "2016-04-01" }
		];
		var names;
		conti.exec([
			function(done){
				conti.forEach(masters, function(master, done){
					master = util.assign(util.mockIyakuhinMaster(), master);
					db.insertIyakuhinMaster(conn, master, done);
				}, done);
			},
			function(done){
				db.getNamesOfIyakuhin(conn, 1234, function(err, result){
					if( err ){
						done(err);
						return;
					}
					names = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(names).eql({
				name: masters[0].name,
				yomi: masters[0].yomi
			})
			done();
		})
	});
})