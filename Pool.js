var mysql = require("mysql");

function Pool(config){
	this.pool = mysql.createPool(config);
}

Pool.prototype.getConnection = function(cb){
	this.pool.getConnection(function(err, conn){
		if( err ){
			throw err;
		}
		cb(conn);
	});
};

Pool.prototype.dispose = function(cb){
	this.pool.end(function(err){
		if( err ){
			throw err;
		}
		if( cb ){
			cb();
		}
	});
}

exports.createPool = function(config){
	return new Pool(config);
}