var expect = require("chai").expect;
var setup = require("./setup");

describe("Testing mysql connection", function(){
	it("connect/release", function(done){
		setup.connect(function(err, conn){
			if( err ){
				done(err);
				return;
			}
			setup.release(conn, function(err){
				if( err ){
					done(err);
					return;
				}
				expect(setup.confirmNoLeak()).equal(true);
				done();
			})
		})
	})
});