var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");
var conti = require("conti");
var m = require("./model");

var clearTextTable = util.createClearTableFun(["visit_text", "visit"]);

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
});

describe("Testing list texts for visit", function(){

	var conn;

	beforeEach(clearTextTable);
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
	afterEach(clearTextTable);

	it("empty", function(done){
		db.listTextsForVisit(conn, 1000, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var texts = [
			{visit_id: 1},
			{visit_id: 1},
			{visit_id: 2},
			{visit_id: 3},
			{visit_id: 3},
			{visit_id: 3},
			{visit_id: 4},
			{visit_id: 5},
			{visit_id: 6}
		];
		texts = texts.map(util.mockText);
		conti.exec([
			function(done){
				util.batchInsertTexts(conn, texts, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = texts.filter(function(text){
				return text.visit_id === 3;
			});
			db.listTextsForVisit(conn, 3, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(ans);
				done();
			})
		})
	})
});

describe("Testing count texts", function(){
	var conn;

	beforeEach(clearTextTable);
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
	afterEach(clearTextTable);

	it("empty", function(done){
		db.countTextsForVisit(conn, 0, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql(0);
			done();
		})
	});

	it("multiple", function(done){
		var visitId = 37123;
		var n = 3;
		var texts = util.iterMap(n, function(i){
			var props = {
				visit_id: visitId,
				content: "content " + i
			};
			return m.text(props);
		});
		conti.exec([
			function(done){
				m.batchSave(conn, texts, done);
			},
			function(done){
				db.countTextsForVisit(conn, visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					expect(result).equal(n);
					done();
				})
			}
		], done);
	});
});

describe("Testing searchTextForPatient", function(){
	var conn;

	beforeEach(clearTextTable);
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
	afterEach(clearTextTable);

	it("empty", function(done){
		db.searchTextForPatient(conn, 0, "test", function(err, result){
			expect(err).not
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var patientId = 100;
		var visit = util.mockVisit({
			patient_id: patientId
		});
		var text1 = util.mockText({
			content: "hello"
		});
		var text2 = util.mockText({
			content: "qrst"
		});
		var searchResult;
		conti.exec([
			function(done){
				db.insertVisit(conn, visit, done);
			},
			function(done){
				text1.visit_id = visit.visit_id;
				text2.visit_id = visit.visit_id;
				conti.forEach([text1, text2], function(text, done){
					db.insertText(conn, text, done);
				}, done);
			},
			function(done){
				console.log("enter search")
				db.searchTextForPatient(conn, patientId, "rs", function(err, result){
					if( err ){
						done(err);
						return;
					}
					searchResult = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			text2.v_datetime = visit.v_datetime;
			var ans = [text2];
			expect(searchResult).eql(ans);
			done();
		})
	})
});

describe("Testing searchWholeText", function(){
	var conn;

	beforeEach(clearTextTable);
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
	afterEach(clearTextTable);

	it("empty", function(done){
		db.searchWholeText(conn, "test", function(err, result){
			expect(err).not
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		var patient1 = util.mockPatient();
		var patient2 = util.mockPatient();
		var visit1 = util.mockVisit();
		var visit2 = util.mockVisit();
		var text1 = util.mockText({
			content: "abcd"
		});
		var text2 = util.mockText({
			content: "pqrs"
		})
		var text3 = util.mockText({
			content: "cdef"
		});
		var searchResult;
		conti.exec([
			function(done){
				conti.forEach([patient1, patient2], function(patient, done){
					db.insertPatient(conn, patient, done);
				}, done);
			},
			function(done){
				visit1.patient_id = patient1.patient_id;
				visit2.patient_id = patient2.patient_id;
				conti.forEach([visit1, visit2], function(visit, done){
					db.insertVisit(conn, visit, done);
				}, done);
			},
			function(done){
				text1.visit_id = visit1.visit_id;
				text2.visit_id = visit1.visit_id;
				text3.visit_id = visit2.visit_id;
				conti.forEach([text1, text2, text3], function(text, done){
					db.insertText(conn, text, done);
				}, done);
			},
			function(done){
				db.searchWholeText(conn, "d", function(err, result){
					if( err ){
						done(err);
						return;
					}
					searchResult = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			text3.v_datetime = visit2.v_datetime;
			text3.patient_id = patient2.patient_id;
			text3.last_name = patient2.last_name;
			text3.first_name = patient2.first_name;
			text1.v_datetime = visit1.v_datetime;
			text1.patient_id = patient1.patient_id;
			text1.last_name = patient1.last_name;
			text1.first_name = patient1.first_name;
			var ans = [text3, text1];
			expect(searchResult).eql(ans);
			done();
		})
	})
})