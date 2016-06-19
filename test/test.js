require("./test-Pool.js");
require("./test-db.js");
after(function(done){
	console.log("cleaning up pool");
	require("./pool.js").cleanUp();
	done();
});
