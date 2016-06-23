var setup = require("./setup");
var expect = require("chai").expect;
var util = require("./util");
var db = require("../index");

var clearTable = util.createClearTableFun("visit_gazou_label");

describe("Testing gazouLabel", function(){
	before(clearTable);
	after(clearTable);

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
		var gazouLabel = util.mockGazouLabel();
		db.insertGazouLabel(conn, gazouLabel, function(err){
			expect(err).not.ok;
			done();
		})
	});
	it("get", function(done){
		var gazouLabel = util.mockGazouLabel();
		db.insertGazouLabel(conn, gazouLabel, function(err){
			if( err ){
				done(err);
				return;
			}
			db.getGazouLabel(conn, gazouLabel.visit_conduct_id, function(err, row){
				if( err ){
					done(err);
					return;
				}
				util.deleteUnusedGazouLabelColumn(row);
				expect(row).eql(gazouLabel);
				done();
			})
		})
	});
	it("update", function(done){
		var gazouLabel = util.mockGazouLabel();
		db.insertGazouLabel(conn, gazouLabel, function(err){
			if( err ){
				done(err);
				return;
			}
			util.alterGazouLabel(gazouLabel);
			db.updateGazouLabel(conn, gazouLabel, function(err){
				if( err ){
					done(err);
					return;
				}
				db.getGazouLabel(conn, gazouLabel.visit_conduct_id, function(err, row){
					if( err ){
						done(err);
						return;
					}
					util.deleteUnusedGazouLabelColumn(row);
					expect(row).eql(gazouLabel);
					done();
				})
			})
		})
	});
	it("delete", function(done){
		var gazouLabel = util.mockGazouLabel();
		db.insertGazouLabel(conn, gazouLabel, function(err){
			if( err ){
				done(err);
				return;
			}
			db.deleteGazouLabel(conn, gazouLabel.visit_conduct_id, function(err){
				expect(err).not.ok;
				done();
			})
		})
	});
	it("delete/find", function(done){
		var gazouLabel = util.mockGazouLabel();
		db.insertGazouLabel(conn, gazouLabel, function(err){
			if( err ){
				done(err);
				return;
			}
			db.deleteGazouLabel(conn, gazouLabel.visit_conduct_id, function(err){
				if( err ){
					done(err);
					return;
				}
				db.findGazouLabel(conn, gazouLabel.visit_conduct_id, function(err, row){
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
