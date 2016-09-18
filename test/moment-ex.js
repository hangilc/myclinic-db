"use strict";

var moment = require("moment");

moment.fn.toSqlDate = function(){
	return this.format("YYYY-MM-DD");
};

moment.fn.toSqlDateTime = function(){
	return this.format("YYYY-MM-DD HH:mm:ss");
}

module.exports = moment;