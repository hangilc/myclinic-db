"use strict";

function iterExec(i, funs, done){
	if( i >= funs.length ){
		done();
		return;
	}
	var f = funs[i];
	f(function(err){
		if( err ){
			done(err);
			return;
		}
		iterExec(i+1, funs, done);
	})
}

exports.exec = function(funs, done){
	iterExec(0, funs, done);
};

function iterExecForEach(i, arr, fn, done){
	if( i >= arr.length ){
		done();
		return;
	}
	fn(arr[i], function(err){
		if( err ){
			done(err);
			return;
		}
		iterExecForEach(i+1, arr, fn, done);
	})
}

exports.execForEach = function(arr, fn, done){
	iterExecForEach(0, arr, fn, done);
};

exports.forEach = function(arr, fn){
	return function(done){
		iterExecForEach(0, arr, fn, done);
	};
};

