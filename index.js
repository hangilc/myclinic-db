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

Pool.prototype.withConnection = function(cb){
	this.pool.getConnection(function(err, conn){
		if( err ){
			throw err;
		}
		try {
			cb(conn);
		}
		finally {
			console.log("release");
			conn.release();
		}
	})
}

Pool.prototype.dispose = function(){
	this.pool.end(function(err){
		if( err ){
			throw err;
		}
	});
}

exports.Pool = Pool;

function query(conn, sql, args){
	if( args == null ) args = [];
    return new Promise(function(resolve, reject){
        conn.query(sql, args, function(err, results){
            if( err ){
                reject(err);
                return;
            }
            resolve(results);
        })
    })
}

exports.query = query;

