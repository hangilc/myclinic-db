function extend(dst, src){
	for(var key in src){
		dst[key] = src[key];
	}
}

var db = {}
extend(db, require("./lib/patient"));
extend(db, require("./lib/visit"));
extend(db, require("./lib/text"));
module.exports = db;
