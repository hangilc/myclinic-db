//var dbPool = require("./pool.js").getPool();
var db = require("../index");
var expect = require("chai").expect;
var setup = require("./setup");
var kanjidate = require("kanjidate");


function clearHotline(done){
	setup.openConnection(function(c){
		db.exec(c, "delete from hotline")
		.then(function(){
			setup.closeConnection(c);
			done();
		})
	})
}

before(clearHotline);
after(clearHotline);

function makeData(message){
	return {
		hotline_id: null,
		message: message,
		sender: "practice",
		recipient: "pharmacy",
		m_datetime: kanjidate.format(kanjidate.fSqlDateTime, new Date())
	};
}

function insertHotline(conn, data){
	var at = kanjidate.format(kanjidate.fSqlDateTime, new Date());
	return db.insert(conn, "insert into hotline set message = ?, sender = ?, recipient = ?, m_datetime = ?",
		[data.message, data.sender, data.recipient, data.m_datetime])
	.then(function(insertId){
		if( insertId < 0 ){
			throw new Error("db.insert failed");
		}
		data.hotline_id = insertId;
		return data;
	})
}

function getHotline(conn, hotline_id){
	return db.get(conn, "select * from hotline where hotline_id = ?", [hotline_id]);
}

function findHotline(conn, hotline_id){
	return db.find(conn, "select * from hotline where hotline_id = ?", [hotline_id]);
}

describe("Testing basic functionalisty (getConnection)", function(){
	var conn;
	beforeEach(function(done){
		setup.openConnection(function(conn_){
			conn = conn_;
			done();
		});
	});

	afterEach(function(done){
		setup.closeConnection(conn);
		done();
	});

	it("test find", function(done){
		db.find(conn, "select * from hotline where hotline_id = 0")
		.then(function(result){
			expect(result).to.equal(null);
			done();
		})
		.catch(done);
	});
	it("test insert and get", function(done){
		var data = makeData("hello");
		insertHotline(conn, data)
		.then(function(){
			return getHotline(conn, data.hotline_id);
		})
		.then(function(row){
			expect(row).to.eql(data);
		})
		.then(done, done);
	});
	it("test insert and find", function(done){
		var data = makeData("hello");
		insertHotline(conn, data)
		.then(function(){
			return findHotline(conn, data.hotline_id)
		})
		.then(function(row){
			expect(row).to.eql(data);
		})
		.then(done, done);
	});
	it("test insert and query", function(done){
		var data1 = makeData("hello data1");
		var data2 = makeData("hello data2");
		insertHotline(conn, data1)
		.then(function(){
			return insertHotline(conn, data2);
		})
		.then(function(){
			return db.query(conn, "select * from hotline where hotline_id in (?, ?) order by hotline_id",
				[data1.hotline_id, data2.hotline_id]);
		})
		.then(function(rows){
			expect(rows).to.eql([data1, data2]);
		})
		.then(done, done);
	});
	it("test insert/update/get", function(done){
		var data = makeData("hello");
		var newMessage = "changed";
		insertHotline(conn, data)
		.then(function(){
			return db.update(conn, "update hotline set message = ? where hotline_id = ?", 
				[newMessage, data.hotline_id])
		})
		.then(function(result){
			if( result !== true ){
				throw new Error("db.update returned not true");
			}
			return getHotline(conn, data.hotline_id)
		})
		.then(function(row){
			data.message = newMessage;
			expect(row).to.eql(data);
		})
		.then(done, done);
	});
	it("test insert/get/delete/find", function(done){
		var data = {
			message: "hello",
			sender: "practice",
			recipient: "pharmacy",
			m_datetime: "2016-06-19 15:21:00"			
		};
		db.insert(conn, "insert into hotline set message = ?, sender = ?, " +
			"recipient = ?, m_datetime = ?",
			[data.message, data.sender, data.recipient, data.m_datetime])
		.then(function(insertId){
			expect(insertId).to.above(0);
			data.hotline_id = insertId;
			return db.get(conn, "select * from hotline where hotline_id = ?", [data.hotline_id]);
		})
		.then(function(row){
			expect(row).to.eql(data);
			return db.delete(conn, "delete from hotline where hotline_id = ?", [data.hotline_id]);
		})
		.then(function(result){
			expect(result).to.equal(true);
			return db.find(conn, "select * from hotline where hotline_id = ?", [data.hotline_id])
		})
		.then(function(result){
			expect(result).to.equal(null);
			done();
		})
		.catch(done);
	});
	it("test getValue", function(done){
		var data = {
			message: "hello",
			sender: "practice",
			recipient: "pharmacy",
			m_datetime: "2016-06-19 15:21:00"			
		};
		db.insert(conn, "insert into hotline set message = ?, sender = ?, " +
			"recipient = ?, m_datetime = ?",
			[data.message, data.sender, data.recipient, data.m_datetime])
		.then(function(insertId){
			expect(insertId).to.above(0);
			data.hotline_id = insertId;
			return db.getValue(conn, "select count(*) from hotline where hotline_id = ?",
				[insertId]);
		})
		.then(function(result){
			expect(result).to.equal(1);
			done();
		})
		.catch(done);
	});
});