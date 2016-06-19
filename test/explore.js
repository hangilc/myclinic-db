var expect = require("chai").expect;

describe("explore expect", function(){
	it("single test", function(){
		expect(0).to.equal(1);
		expect(1).to.equal(1);
	})
	it("single test 2", function(){
		expect(1).to.equal(1);
	})
})