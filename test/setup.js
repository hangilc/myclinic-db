var config = require("./db-config");
var mysql = require("mysql");

var conn = mysql.createConnection(config);

exports.getConnection = function(){
	return conn;
}

exports.disposeConnection = function(conn, done){
	conn.end(done);
}

exports.connect = function(cb){
	cb(undefined, conn);
}

exports.release = function(conn, cb){
	cb();
}

exports.confirmNoLeak = function(){
	return true;
}