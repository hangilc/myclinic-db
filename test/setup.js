var config = require("./db-config");
var mysql = require("mysql");

var nConn = 0;

exports.connect = function(cb){
	if( nConn > 0 ){
		cb("connection not released");
	}
	var conn = mysql.createConnection(config);
	nConn += 1;
	conn.connect(function(err){
		if( err ){
			conn.end();
			nConn -= 1;
		}
		cb(err, conn);
	});
}

exports.release = function(conn, cb){
	nConn -= 1;
	conn.end(cb);
}

exports.confirmNoLeak = function(){
	return nConn == 0;
}