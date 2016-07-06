function extend(dst, src){
	for(var key in src){
		if( key in dst ){
			throw new Error("already defined: " + key);
		}
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
extend(db, require("./lib/conduct"));
extend(db, require("./lib/gazou-label"));
extend(db, require("./lib/conduct-shinryou"));
extend(db, require("./lib/conduct-drug"));
extend(db, require("./lib/conduct-kizai"));
extend(db, require("./lib/iyakuhin-master"));
extend(db, require("./lib/shinryou-master"));
extend(db, require("./lib/shoubyoumei-master"));
extend(db, require("./lib/shuushokugo-master"));
extend(db, require("./lib/kizai-master"));
extend(db, require("./lib/charge"));
extend(db, require("./lib/wqueue"));
extend(db, require("./lib/pharma-queue"));
extend(db, require("./lib/disease"));
extend(db, require("./lib/recent-visits"));
extend(db, require("./lib/full-wqueue"));
extend(db, require("./lib/list-todays-visits"));
module.exports = db;
