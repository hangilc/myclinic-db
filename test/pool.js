var db = require("../index");

var config = {
	host: "127.0.0.1",
    user: process.env.MYCLINIC_DB_TEST_USER,
    password: process.env.MYCLINIC_DB_TEST_PASS,
    database: "myclinic_test",
    dateStrings: true
};

var dbPool = db.createPool(config);

exports.getPool = function(){
	return dbPool;
};

exports.withConnection = function(cb){
	dbPool.withConnection(cb);
};

exports.cleanUp = function(){
	dbPool.dispose();
};
