var util = require("./util");
var setup = require("./setup");
var db = require("../index");
var expect = require("chai").expect;
var conti = require("conti");
var moment = require("moment");

function resetTables(done){
	util.withConnect(function(conn, done){
		util.resetTables(conn, ["patient", "visit"], done);
	}, done);
}

function createMockPatients(n){
	return util.range(0, n).map(function(i){
		var p = util.mockPatient();
		p.last_name += i;
		return p;
	});
}

var retry = 1;

function testSimple(conn, done){
	var patients = createMockPatients(20);
	var items = [];
	var nPrev = 4;
	var startDate = moment().format("YYYY-MM-DD");
	conti.exec([
		function(done){
			util.batchInsertPatients(conn, patients, done);
		},
		function(done){
			patients.forEach(function(patient, i){
				var n = 1;
				if( i === 3 || i === 10 ){
					n = 2;
				} else if( i === 6 ){
					n = 3;
				}
				for(var j=0; j<n; j++){
					items.push({
						patient: patient,
						visit: util.mockVisit({patient_id: patient.patient_id,
							v_datetime: moment().format("YYYY-MM-DD HH:mm:ss")})
					})
				}
			});
			items.slice(0, nPrev).forEach(function(item){
				item.visit.v_datetime = moment().add(-1, "day").format("YYYY-MM-DD HH:mm:ss");
			})
			var visits = items.map(function(item){ return item.visit; });
			util.batchInsertVisits(conn, visits, done);
		}
	], function(err){
		if( err ){
			done(err);
			return;
		}
		var ans = items.slice(nPrev).map(function(item){
			var visit = item.visit;
			var patient = item.patient;
			return {
				visit_id: visit.visit_id,
				patient_id: patient.patient_id,
				last_name: patient.last_name,
				first_name: patient.first_name,
				last_name_yomi: patient.last_name_yomi,
				first_name_yomi: patient.first_name_yomi
			}
		})
		db.listTodaysVisits(conn, function(err, result){
			if( err ){
				done(err);
				return;
			}
			var endDate = moment().format("YYYY-MM-DD");
			if( startDate !== endDate ){
				if( retry-- > 0 ){
					util.resetTables(conn, ["patient", "visit"], function(err){
						if( err ){
							done(err);
							return;
						}
						testSimple(conn, done);
					});
					return;
				}
			}
			expect(result).eql(ans);
			done();
		})
	})
}

describe("Testing list todays visits", function(){
	var conn;

	beforeEach(resetTables);

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

	afterEach(resetTables);

	it("empty", function(done){
		db.listTodaysVisits(conn, function(err, result){
			expect(result).eql([]);
			done();
		})
	});

	it("simple", function(done){
		testSimple(conn, done);
	});
})