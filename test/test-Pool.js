var expect = require("chai").expect;
var dbPool = require("./pool.js").getPool();

describe("Testing Pool", function(){
	it("create connection", function(){
		dbPool.getConnection(function(conn){
			conn.release();
		});
	});
});