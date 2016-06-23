function extend(dst, src){
	for(var key in src){
		dst[key] = src[key];
	}
}

var db = {}
extend(db, require("./lib/patient"));
extend(db, require("./lib/visit"));
extend(db, require("./lib/text"));
extend(db, require("./lib/shahokokuho"));
extend(db, require("./lib/koukikourei"));
extend(db, require("./lib/roujin"));
extend(db, require("./lib/kouhi"));
extend(db, require("./lib/drug"));
extend(db, require("./lib/shinryou"));
module.exports = db;
