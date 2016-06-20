var db = require("../index");
var config = require("./db-config");

var dbPool = db.createPool(config);

exports.getPool = function(){
	return dbPool;
};

// exports.withConnection = function(cb){
// 	dbPool.withConnection(cb);
// };

// exports.cleanUp = function(){
// 	dbPool.dispose();
// };
