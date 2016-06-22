var setup = require("./setup");

exports.createClearTableFun = function(tableName){
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
				conn.query("alter table " + tableName + " auto_increment = 1", function(err){
					if( err ){
						setup.release(conn, function(){
							done(err);
						});
						return;
					}
					setup.release(conn, done);
				})
			})
		})
	};
};

var mockTextIndex = 1;

exports.mockText = function(){
	return {
		visit_id: 1,
		content: "テスト" + mockTextIndex++
	};
};

exports.deleteUnusedTextColumn = function(text){
	delete text.pos;
};

exports.alterText = function(text){
	text.content += ":altered" + mockTextIndex++; 
}