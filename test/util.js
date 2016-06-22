var setup = require("./setup");

exports.createDeleteTableFun = function(tableName){
	return function(done){
		setup.connect(function(err, conn){
			if( err ){
				done(err);
				return;
			}
			conn.query("delete from " + tableName, function(err){
				if( err ){
					setup.release(conn, function(){
						done(err);
					});
					return;
				}
				setup.release(conn, done);
			})
		})
	};
};