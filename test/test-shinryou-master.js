var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var moment = require("moment");
var model = require("./model");
var conti = require("../lib/conti");

var clearTable = util.createClearTableFun("shinryoukoui_master_arch");

describe("Testing shinryou master", function(){
	before(clearTable);
	after(clearTable);

	var conn;

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

	it("insert", function(done){
		var master = util.mockShinryouMaster();
		db.insertShinryouMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			done();
		})
	});
	it("get (no limit)", function(done){
		var master = util.mockShinryouMaster();
		master.valid_upto = "0000-00-00";
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertShinryouMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getShinryouMaster(conn, master.shinryoucode, at, function(err, row){
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
		var master = util.mockShinryouMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertShinryouMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getShinryouMaster(conn, master.shinryoucode, at, function(err, row){
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
		var master = util.mockShinryouMaster();
		master.valid_upto = "0000-00-00";
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertShinryouMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findShinryouMaster(conn, master.shinryoucode, at, function(err, row){
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
		var master = util.mockShinryouMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertShinryouMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findShinryouMaster(conn, master.shinryoucode, at, function(err, row){
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
		var master = util.mockShinryouMaster();
		master.valid_upto = "0000-00-00";
		var at = moment(master.valid_from).add(-1, "month").format("YYYY-MM-DD");
		db.insertShinryouMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findShinryouMaster(conn, master.shinryoucode, at, function(err, row){
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
		var master = util.mockShinryouMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_upto).add(1, "day").format("YYYY-MM-DD");
		db.insertShinryouMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findShinryouMaster(conn, master.shinryoucode, at, function(err, row){
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
		var master = util.mockShinryouMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_upto).add(1, "hour").format("YYYY-MM-DD HH:mm:ss");
		db.insertShinryouMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findShinryouMaster(conn, master.shinryoucode, at, function(err, row){
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

describe("Testing searchShinryouMaster", function(){
	var conn = setup.getConnection();
	beforeEach(clearTable);
	afterEach(clearTable);

	var valid_from = "2016-04-01";
	var at = "2016-07-11 12:23:44";
	var valid_upto = "0000-00-00";

	it("empty", function(done){
		db.searchShinryouMaster(conn, "テスト", at, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	function makeMasters(names){
		var shinryoucode = 10000;
		return names.map(function(name){
			return model.shinryouMaster({
				shinryoucode: shinryoucode++,
				name: name,
				valid_from: valid_from,
				valid_upto: valid_upto
			})
		});
	}

	it("3 masters (2 match)", function(done){
		var masters = makeMasters(["初診", "再診", "処方料"]);
		conti.exec([
			function(done){
				model.batchSave(conn, masters, done);
			},
			function(done){
				db.searchShinryouMaster(conn, "診", at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [masters[0], masters[1]].map(function(master){
						return master.data;
					});
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});

	it("3 masters ( match)", function(done){
		var masters = makeMasters(["初診", "再診", "処方料"]);
		conti.exec([
			function(done){
				model.batchSave(conn, masters, done);
			},
			function(done){
				db.searchShinryouMaster(conn, "処", at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var ans = [masters[2]].map(function(master){
						return master.data;
					});
					expect(result).eql(ans);
					done();
				})
			}
		], done);
	});
})