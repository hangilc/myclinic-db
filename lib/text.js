"use strict";

var util = require("./util");

exports.insertText = function(conn, text, cb){
    var sql = "insert into visit_text set visit_id = ?, content = ?";
    var args = [text.visit_id, text.content];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	var textId = result.insertId;
    	text.text_id = textId;
    	cb(undefined, textId);
    });
};

exports.getText = function(conn, textId, cb){
	var sql = "select * from visit_text where text_id = ?";
	conn.query(sql, [textId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var text = result[0];
			util.deleteUnusedTextColumn(text);
			cb(undefined, text);
			return;
		}
		cb("getText failed");
	})
};

exports.findText = function(conn, textId, cb){
	var sql = "select * from visit_text where text_id = ?";
	conn.query(sql, [textId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			var text = result[0];
			util.deleteUnusedTextColumn(text);
			cb(undefined, text);
			return;
		}
		if( result.length === 0 ){
			cb(undefined, null);
			return;
		}
		cb("findText failed");
	})
};

exports.updateText = function(conn, text, cb){
    var sql = "update visit_text set visit_id = ?, content = ? where text_id = ?";
    var args = [text.visit_id, text.content, text.text_id];
    conn.query(sql, args, function(err, result){
    	if( err ){
    		cb(err);
    		return;
    	}
    	if( result.affectedRows === 1 ){
    		cb();
    		return;
    	}
    	cb("updateText failed");
    });
};

exports.deleteText = function(conn, textId, cb){
	var sql = "delete from visit_text where text_id = ?";
	conn.query(sql, [textId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.affectedRows === 1 ){
			cb();
			return;
		}
		cb("deleteText failed");
	})
};

exports.listTextsForVisit = function(conn, visitId, cb){
	var sql = "select * from visit_text where visit_id = ? order by text_id";
	conn.query(sql, [visitId], function(err, result){
		if( err ){
			cb(err);
			return;
		}
		result.forEach(util.deleteUnusedTextColumn);
		cb(undefined, result);
	});
};

exports.countTextsForVisit = function(conn, visitId, cb){
	var sql = "select count(*) as c from visit_text where visit_id = ?";
	var args = [visitId];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, result[0].c);
	})
};