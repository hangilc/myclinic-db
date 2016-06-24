"use strict";

exports.seq = function(funs, done){
	iter(0);

	function iter(i){
		if( i >= funs.length ){
			done();
			return;
		}
		funs[i](function(err){
			if( err ){
				done(err);
				return;
			}
			iter(i+1);
		});
	}
};

exports.para = function(funs, done){
	var hasError = false;
	var remain = funs.length;

	for(var i=0;i<funs.length;i++){
		funs[i](cb);
	}

	function cb(err){
		if( hasError ){
			return;
		}
		if( err ){
			hasError = true;
			done(err);
			return;
		}
		remain -= 1;
		if( remain === 0 ){
			done();
		}
	}
};



