var dbPool = require("./pool.js").getPool();
var db = require("../index");
var expect = require("chai").expect;

var conn;

function clearHotline(done){
	dbPool.getConnection(function(c){
		db.exec(c, "delete from hotline")
		.then(function(){
			c.release();
			done();
		})
	})
}

before(clearHotline);
after(clearHotline);

beforeEach(function(done){
	dbPool.getConnection(function(conn_){
		conn = conn_;
		done();
	});
});

afterEach(function(done){
	conn.release();
	done();
});

describe("Testing basic functionalisty", function(){
	it("test find", function(done){
		db.find(conn, "select * from hotline where hotline_id = 0")
		.then(function(result){
			expect(result).to.equal(null);
			done();
		})
		.catch(done);
	});
	it("test insert and get", function(done){
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
			if( insertId <= 0 ){
				throw new Error("invalid insertId")
			}
			data.hotline_id = insertId;
			return db.get(conn, "select * from hotline where hotline_id = ?", [insertId])
		})
		.then(function(row){
			expect(row).to.eql(data);
			done();
		})
		.catch(done);
	});
	it("test insert and find", function(done){
		var data = {
			message: "hello find",
			sender: "practice",
			recipient: "pharmacy",
			m_datetime: "2016-06-19 15:21:00"			
		};
		db.insert(conn, "insert into hotline set message = ?, sender = ?, " +
			"recipient = ?, m_datetime = ?",
			[data.message, data.sender, data.recipient, data.m_datetime])
		.then(function(insertId){
			if( insertId <= 0 ){
				throw new Error("invalid insertId")
			}
			data.hotline_id = insertId;
			return db.find(conn, "select * from hotline where hotline_id = ?", [insertId])
		})
		.then(function(row){
			expect(row).to.eql(data);
			done();
		})
		.catch(done);
	});
	it("test insert and query", function(done){
		var data1 = {
			message: "hello data1",
			sender: "practice",
			recipient: "pharmacy",
			m_datetime: "2016-06-19 15:21:00"			
		};
		var data2 = {
			message: "hello data2",
			sender: "practice",
			recipient: "cashier",
			m_datetime: "2016-06-19 15:26:00"			
		};
		db.insert(conn, "insert into hotline set message = ?, sender = ?, " +
			"recipient = ?, m_datetime = ?",
			[data1.message, data1.sender, data1.recipient, data1.m_datetime])
		.then(function(insertId){
			data1.hotline_id = insertId;
			return db.insert(conn, "insert into hotline set message = ?, sender = ?, " +
				"recipient = ?, m_datetime = ?",
				[data2.message, data2.sender, data2.recipient, data2.m_datetime])
		})
		.then(function(insertId){
			data2.hotline_id = insertId;
			return db.query(conn, "select * from hotline where hotline_id in (?, ?) order by hotline_id",
				[data1.hotline_id, data2.hotline_id]);
		})
		.then(function(rows){
			expect(rows).to.eql([data1, data2]);
			done();
		})
		.catch(done);
	});
	it("test insert/update/get", function(done){
		var data = {
			message: "hello",
			sender: "practice",
			recipient: "pharmacy",
			m_datetime: "2016-06-19 15:21:00"			
		};
		var newMessage = "changed";
		db.insert(conn, "insert into hotline set message = ?, sender = ?, " +
			"recipient = ?, m_datetime = ?",
			[data.message, data.sender, data.recipient, data.m_datetime])
		.then(function(insertId){
			if( insertId <= 0 ){
				throw new Error("invalid insertId")
			}
			data.hotline_id = insertId;
			return db.update(conn, "update hotline set message = ? where hotline_id = ?", 
				[newMessage, data.hotline_id])
		})
		.then(function(result){
			if( result !== true ){
				throw new Error("db.update returned not true");
			}
			return db.get(conn, "select * from hotline where hotline_id = ?", [data.hotline_id])
		})
		.then(function(row){
			data.message = newMessage;
			expect(row).to.eql(data);
			done();
		})
		.catch(done);
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