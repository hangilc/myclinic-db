"use strict";

var moment = require("moment");
var util = require("../lib/util");
var expect = require("chai").expect;

describe("Testing moment to SqlDateTime", function(){
	it("format pm time", function(){
		var m = moment([2016, 5, 30, 23, 29, 12]);
		expect(util.momentToSqlDateTime(m)).eql("2016-06-30 23:29:12");
	})

});