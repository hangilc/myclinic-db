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

exports.forEach = function(arr, fn, done){
	iterExecForEach(0, arr, fn, done);
};

exports.taskForEach = function(arr, fn){
	return function(done){
		if( typeof arr === "function" ){
			arr = arr();
		}
		iterExecForEach(0, arr, fn, done);
	};
};

function iterRange(i, start, end, fn, done){
	if( i >= end ){
		done();
		return;
	}
	fn(function(err){
		if( err ){
			done(err);
			return;
		}
		iterRange(i+1, start, end, fn, done);
	});
}

exports.range = function(start, end, fn, done){
	iterRange(0, start, end, fn, done);
};

exports.taskRange = function(start, end, fn){
	return function(done){
		if( typeof start === "function" ){
			start = start();
		}
		if( typeof end === "function" ){
			end = end();
		}
		iterRange(0, start, end, fn, done);
	}
};