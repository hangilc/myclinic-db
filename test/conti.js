"use strict";

exports.exec = function(funs, done){
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

exports.range = function(begin, end, fn){
	return function(done){
		iter(begin);

		function iter(i){
			if( i >= end ){
				done();
				return;
			}
			fn(i, function(err){
				if( err ){
					done(err);
					return;
				}
				iter(i+1);
			})
		}
	};
};

exports.forEach = function(arr, fn){
	return exports.range(0, arr.length, function(i, done){
		fn(arr[i], done);
	});
}

exports.forEachKey = function(obj, fn){
	return exports.forEach(Object.keys(obj), fn);
};

