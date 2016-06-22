var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTextTable = util.createClearTableFun("visit_text");

describe("Testing text", function(){
	before(clearTextTable);
	after(clearTextTable);

	var conn;

	beforeEach(function(done){
		setup.connect(function(err, conn_){
			if( err ){
				done(err);
				return;
			}
			conn = conn_;
			done();
		})
	});

	afterEach(function(done){
		setup.release(conn, done);
	});

	it("insert", function(done){
		var text = util.mockText();
		db.insertText(conn, text, function(err, textId){
			if( err ){
				done(err);
				return;
			}
			expect(text.text_id).above(0);
			expect(textId).above(0);
			expect(text.text_id).equal(textId);
			done();
		})
	});
	it("get", function(done){
		var text = util.mockText();
		db.insertText(conn, text, function(err, textId){
			if( err ){
				done(err);
				return;
			}
			db.getText(conn, textId, function(err, row){
				if( err ){
					done(err);
					return;
				}
				util.deleteUnusedTextColumn(row);
				expect(row).eql(text);
				done();
			})
		})
	});
	it("update", function(done){
		var text = util.mockText();
		db.insertText(conn, text, function(err, textId){
			if( err ){
				done(err);
				return;
			}
			util.alterText(text);
			db.updateText(conn, text, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getText(conn, textId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					util.deleteUnusedTextColumn(row);
					expect(row).eql(text);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var text = util.mockText();
		db.insertText(conn, text, function(err, textId){
			if( err ){
				done(err);
				return;
			}
			db.deleteText(conn, textId, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var text = util.mockText();
		db.insertText(conn, text, function(err, textId){
			if( err ){
				done(err);
				return;
			}
			db.deleteText(conn, textId, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findText(conn, textId, function(err, row){
					if( err ){
						done(err);
						return;
					}
					expect(row).null;
					done();
				})
			})
		})
	})
})