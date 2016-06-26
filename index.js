function extend(dst, src){
	for(var key in src){
		if( key in dst ){
			throw new Error("already defined: " + key);
		}
		dst[key] = src[key];
	}
}

var db = require("./db");
extend(db, require("./lib/full-visit"));
module.exports = db;
