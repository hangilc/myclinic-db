var expect = require("chai").expect;
var db = require("../index");
var config = require("./db-config");

var pool;

before(function(done){
	pool = db.createPool(config);
	done();
});

after(function(done){
	pool.dispose();
	done();
})

describe("Testing Pool", function(){
	it("create connection", function(done){
		pool.openConnection(function(conn){
			pool.closeConnection(conn);
			expect(pool.usedConnect).to.equal(0);
			done();
		})
	});
	it("with connection", function(done){
		pool.withConnection(function(conn){
			return Promise.resolve(true);
		}, function(err){
			expect(undefined).to.be.undefined;
			expect(pool.usedConnect).to.equal(0);
			done();
		});
	});
	it("with connection (not promise)", function(done){
		pool.withConnection(function(conn){
			return ;
		}, function(err){
			expect(pool.usedConnect).to.equal(0);
			done();
		});
	})
	it("with connection (fail)", function(done){
		pool.withConnection(function(conn){
			return Promise.reject("error");
		}, function(err){
			expect(pool.usedConnect).to.equal(0);
			done();
		});
	})
});