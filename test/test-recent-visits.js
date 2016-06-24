var expect = require("chai").expect;
var setup = require("./setup");
var util = require("./util");
var db = require("../index");

function initDb(done){
	util.withConnect(function(conn, cb){
		util.resetTables(conn, ["patient", "visit"], cb);
	},
	done);
}

function makeVisits(conn, n, cb){
	var result = [];
	iter(0);

	function iter(i){
		if( i >= n ){
			cb(undefined, result);
			return;
		}
		var patient = util.mockPatient();
		patient.last_name += i;
		patient.first_name += i;
		patient.last_name_yomi += i;
		patient.first_name_yomi += i;
		db.insertPatient(conn, patient, function(err){
			if( err ){
				cb(err);
				return;
			}
			var visit = util.mockVisit();
			visit.patient_id = patient.patient_id;
			db.insertVisit(conn, visit, function(err){
				result.push({patient: patient, visit: visit});
				iter(i+1);
			})
		})
	}
}

function mapResult(result){
	var p = result.patient;
	var v = result.visit;
	return {
		patient_id: p.patient_id,
		last_name: p.last_name,
		first_name: p.first_name,
		last_name_yomi: p.last_name_yomi,
		first_name_yomi: p.first_name_yomi,
		visit_id: v.visit_id
	}
}

describe("Testing recentVisits", function(){
	before(initDb);
	after(initDb);

	var conn;

	beforeEach(function(done){
		setup.connect(function(err, conn_){
			conn = conn_;
			done(err);
		})
	});

	afterEach(function(done){
		setup.release(conn, done);
	});

	it("with n = 30", function(done){
		var n = 30;
		makeVisits(conn, n + 2, function(err, result){
			if( err ){ done(err); return; }
			var ex = result.reverse().slice(0, n).map(mapResult);
			db.recentVisits(conn, n, function(err, rows){
				if( err ){ done(err); return ; }
				expect(rows).eql(ex);
				done();
			})
		})
	})
});