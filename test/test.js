require("./test-Pool");
require("./test-db");
after(function(done){
	require("./setup").cleanUp();
	done();
})

