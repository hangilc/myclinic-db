var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var moment = require("moment");

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