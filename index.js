function extend(dst, src){
	for(var key in src){
		dst[key] = src[key];
	}
}

var db = {}
db.Pool = require("./Pool");
extend(db, require("./db"));
//extend(db, require("./patient"));
module.exports = db;
