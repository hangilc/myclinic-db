function extend(dst, src){
	for(var key in src){
		if( key in dst ){
			throw new Error("already defined: " + key);
		}
		dst[key] = src[key];
	}
}

var db = require("./db");
extend(db, require("./lib/full-conduct"));
extend(db, require("./lib/full-visit"));
extend(db, require("./lib/hoken"));
extend(db, require("./lib/start-visit"));
extend(db, require("./lib/safely-delete-conduct"));
extend(db, require("./lib/safely-delete-visit"));
extend(db, require("./lib/full-disease"));
extend(db, require("./lib/presc-done"));
extend(db, require("./lib/list-iyakuhin-by-patient"));
module.exports = db;
