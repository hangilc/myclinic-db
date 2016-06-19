var expect = require("chai").expect;
var execSync = require("child_process").execSync;

before(function(done){
	execSync("mysql -u %MYCLINIC_DB_TEST_USER% -p%MYCLINIC_DB_TEST_PASS% myclinic_test <schema.sql")
	done();
});

describe("expect", function(){
	it("expect availablae", function(){
		expect(1).equal(1);
	})
})

describe("expect 2", function(){
	it("expect availablae", function(){
		expect(1).equal(1);
	})
})