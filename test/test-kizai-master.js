var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var moment = require("moment");
var model = require("./model");
var conti = require("../lib/conti");

var clearTable = util.createClearTableFun("tokuteikizai_master_arch");

describe("Testing kizaikizai master", function(){
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
		var master = util.mockKizaiMaster();
		db.insertKizaiMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			done();
		})
	});
	it("get (no limit)", function(done){
		var master = util.mockKizaiMaster();
		master.valid_upto = "0000-00-00";
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertKizaiMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getKizaiMaster(conn, master.kizaicode, at, function(err, row){
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
		var master = util.mockKizaiMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertKizaiMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getKizaiMaster(conn, master.kizaicode, at, function(err, row){
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
		var master = util.mockKizaiMaster();
		master.valid_upto = "0000-00-00";
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertKizaiMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findKizaiMaster(conn, master.kizaicode, at, function(err, row){
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
		var master = util.mockKizaiMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_from).add(1, "month").format("YYYY-MM-DD");
		db.insertKizaiMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findKizaiMaster(conn, master.kizaicode, at, function(err, row){
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
		var master = util.mockKizaiMaster();
		master.valid_upto = "0000-00-00";
		var at = moment(master.valid_from).add(-1, "month").format("YYYY-MM-DD");
		db.insertKizaiMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findKizaiMaster(conn, master.kizaicode, at, function(err, row){
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
		var master = util.mockKizaiMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_upto).add(1, "day").format("YYYY-MM-DD");
		db.insertKizaiMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findKizaiMaster(conn, master.kizaicode, at, function(err, row){
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
		var master = util.mockKizaiMaster();
		master.valid_upto = moment(master.valid_from).add(1, "year").format("YYYY-MM-DD");
		var at = moment(master.valid_upto).add(1, "hour").format("YYYY-MM-DD HH:mm:ss");
		db.insertKizaiMaster(conn, master, function(err){
			if( err ){
				done(err);
				return;
			}
			db.findKizaiMaster(conn, master.kizaicode, at, function(err, row){
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

describe("Testing searchKizaiMaster (simple cases)", function(){
	beforeEach(clearTable);
	afterEach(clearTable);

	var conn = setup.getConnection();

	var valid_from = "2016-04-01";
	var at = "2016-07-11 12:23:44";
	var valid_upto = "0000-00-00";

	it("empty", function(done){
		db.searchKizaiMaster(conn, "テスト", "2016-07-12", function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	})

	function makeMasters(names){
		var kizaicode = 10000;
		return names.map(function(name){
			return model.kizaiMaster({
				kizaicode: kizaicode++,
				name: name,
				valid_from: valid_from,
				valid_upto: valid_upto
			})
		});
	}

	it("3 masters (2 match)", function(done){
		var masters = makeMasters(["あいう", "おう", "かきく"]);
		conti.exec([
			function(done){
				model.batchSave(conn, masters, done);
			},
			function(done){
				db.searchKizaiMaster(conn, "う", at, function(err, result){
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

	it("3 masters (1 match)", function(done){
		var masters = makeMasters(["あいう", "おう", "かきく"]);
		conti.exec([
			function(done){
				model.batchSave(conn, masters, done);
			},
			function(done){
				db.searchKizaiMaster(conn, "か", at, function(err, result){
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
});

describe("Testing searchKizaiMaster (different periods", function(){
	var conn = setup.getConnection();
	beforeEach(clearTable);
	afterEach(clearTable);

	it("1 match", function(done){
		var valid_from_1 = "2014-04-01";
		var valid_upto_1 = "2016-03-31";
		var valid_from_2 = "2016-04-01";
		var valid_upto_2 = "2018-03-31";
		var at_1 = "2015-03-21";
		var at_2 = "2016-12-31";
		var master_1 = model.kizaiMaster({
			name: "あい",
			valid_from: valid_from_1,
			valid_upto: valid_upto_1
		})
		var master_2 = model.kizaiMaster({
			name: "あう",
			valid_from: valid_from_2,
			valid_upto: valid_upto_2
		})
		conti.exec([
			function(done){
				model.batchSave(conn, [master_1, master_2], done);
			},
			function(done){
				db.searchKizaiMaster(conn, "あ", at_1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).eql([master_1.data]);
					done();
				})
			}
		], done);
	})	
});
