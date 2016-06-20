var mysql = require("mysql");

function Pool(config){
	this.pool = mysql.createPool(config);
	this.usedConnect = 0;
}

Pool.prototype.openConnection = function(cb){
	this.pool.getConnection(function(err, conn){
		if( err ){
			throw err;
		}
		this.usedConnect += 1;
		cb(conn);
	}.bind(this));
};

Pool.prototype.closeConnection = function(conn){
	conn.release();
	this.usedConnect -= 1;
}

Pool.prototype.withConnection = function(cb, done){
	try{
		this.openConnection(function(conn){
			try{
				var p = cb(conn);
				if( !(p instanceof Promise) ){
					throw new Error("instance of Promise expected");
				}
				var pp = p.then(function(){
					this.closeConnection(conn);
				}.bind(this), function(err){
					this.closeConnection(conn);
					throw err;
				}.bind(this));
				if( done ){
					pp.then(done, done);
				}
			} catch(err){
				this.closeConnection(conn);
				if( done ){
					done(err);
				} else {
					throw err;
				}
			}
		}.bind(this));
	} catch(err){
		if( done ){
			done(err);
		} else {
			throw err;
		}
	}
}

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