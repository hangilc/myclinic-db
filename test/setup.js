var db = require("../index");
var dbConfig = require("./db-config");
var store = db.createPool(dbConfig);

exports.openConnection = function(cb){
	store.openConnection(cb);
};

exports.closeConnection = function(conn){
	store.closeConnection(conn);
};

exports.cleanUp = function(){
	store.dispose();
}