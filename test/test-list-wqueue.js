var expect = require("chai").expect;
var db = require("../index");
var setup = require("./setup");
var conti = require("./conti");
var util = require("./util");

var wqueueStateWaitExam = 0;
var wqueueStateInExam = 1;
var wqueueStateWaitCashier = 2;
var wqueueStateWaitDrug = 3;
var wqueueStateWaitReExam = 4;
var wqueueStateWaitAppoint = 5;

function insertPatients(conn, patients, cb){
	conti.exec([
		conti.forEach(patients, function(patient, cb){
			db.insertPatient(conn, patient, cb);
		})
	], cb);
}

function insertVisits(conn, visits, cb){
	conti.exec([
		conti.forEach(visits, function(visit, cb){
			db.insertVisit(conn, visit, cb);
		})
	], cb);
}

function insertWqueueList(conn, wqueueList, cb){
	conti.exec([
		conti.forEach(wqueueList, function(wqueue, cb){
			db.insertWqueue(conn, wqueue, cb);
		})
	], cb);
}

function resetTables(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, ["wqueue"], ["patient", "visit"], done);
	}, done);
}

describe("Testing listWqueue", function(){
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
		});
	});

	afterEach(function(done){
		setup.release(conn, done);
	});
	afterEach(resetTables);

	it("list empty", function(done){
		db.listWqueue(conn, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("list 10", function(done){
		var list = util.range(0, 10).map(function(i){
			var patient = util.mockPatient();
			patient.last_name += i;
			return {patient: patient};
		});
		conti.exec([
			function(done){ 
				var patients = list.map(function(item){ return item.patient; });
				insertPatients(conn, patients, done); 
			},
			function(done){
				list.forEach(function(item){
					item.visit = util.mockVisit({patient_id: item.patient.patient_id});
				});
				var visits = list.map(function(item){ return item.visit; });
				insertVisits(conn, visits, done);
			},
			function(done){
				list.forEach(function(item){
					item.wqueue = util.mockWqueue({visit_id: item.visit.visit_id, wait_state: wqueueStateWaitExam});
				});
				var wqueueList = list.map(function(item){ return item.wqueue; });
				insertWqueueList(conn, wqueueList, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = list.map(function(item){
				var o = util.assign({}, item.wqueue);
				return util.assign(o, item.patient);
			});
			db.listWqueue(conn, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(ans);
				done();
			})
		})
	});

	it("variable wait states", function(done){
		var list = util.range(0, 10).map(function(i){
			var patient = util.mockPatient();
			patient.last_name += i;
			return {patient: patient};
		});
		conti.exec([
			function(done){ 
				var patients = list.map(function(item){ return item.patient; });
				insertPatients(conn, patients, done); 
			},
			function(done){
				list.forEach(function(item){
					item.visit = util.mockVisit({patient_id: item.patient.patient_id});
				});
				var visits = list.map(function(item){ return item.visit; });
				insertVisits(conn, visits, done);
			},
			function(done){
				list.forEach(function(item, i){
					var wait_state;
					switch(i){
						case 1: case 8: wait_state = wqueueStateInExam; break;
						case 3: wait_state = wqueueStateWaitCashier; break;
						case 4: wait_state = wqueueStateWaitDrug; break;
						case 5: case 7: wait_state = wqueueStateWaitReExam; break;
						default: wait_state = wqueueStateWaitExam; break;
					}
					item.wqueue = util.mockWqueue({visit_id: item.visit.visit_id, wait_state: wait_state});
				});
				var wqueueList = list.map(function(item){ return item.wqueue; });
				insertWqueueList(conn, wqueueList, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = list.map(function(item){
				var o = util.assign({}, item.wqueue);
				return util.assign(o, item.patient);
			});
			db.listWqueue(conn, function(err, result){
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

describe("Testing listWqueueForExam", function(){
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
		});
	});

	afterEach(function(done){
		setup.release(conn, done);
	});
	afterEach(resetTables);

	it("list empty", function(done){
		db.listWqueueForExam(conn, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		})
	});

	it("all wait exam", function(done){
		var list = util.range(0, 10).map(function(i){
			var patient = util.mockPatient();
			patient.last_name += i;
			return {patient: patient};
		});
		conti.exec([
			function(done){ 
				var patients = list.map(function(item){ return item.patient; });
				insertPatients(conn, patients, done); 
			},
			function(done){
				list.forEach(function(item){
					item.visit = util.mockVisit({patient_id: item.patient.patient_id});
				});
				var visits = list.map(function(item){ return item.visit; });
				insertVisits(conn, visits, done);
			},
			function(done){
				list.forEach(function(item){
					item.wqueue = util.mockWqueue({visit_id: item.visit.visit_id, wait_state: wqueueStateWaitExam});
				});
				var wqueueList = list.map(function(item){ return item.wqueue; });
				insertWqueueList(conn, wqueueList, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = list.map(function(item){
				var o = util.assign({}, item.wqueue);
				return util.assign(o, item.patient);
			});
			db.listWqueueForExam(conn, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(ans);
				done();
			})
		})
	});

	it("variable wait states", function(done){
		var list = util.range(0, 10).map(function(i){
			var patient = util.mockPatient();
			patient.last_name += i;
			return {patient: patient};
		});
		var ansItems = [];
		conti.exec([
			function(done){ 
				var patients = list.map(function(item){ return item.patient; });
				insertPatients(conn, patients, done); 
			},
			function(done){
				list.forEach(function(item){
					item.visit = util.mockVisit({patient_id: item.patient.patient_id});
				});
				var visits = list.map(function(item){ return item.visit; });
				insertVisits(conn, visits, done);
			},
			function(done){
				list.forEach(function(item, i){
					var wait_state;
					switch(i){
						case 1: case 8: wait_state = wqueueStateInExam; break;
						case 3: wait_state = wqueueStateWaitCashier; break;
						case 4: wait_state = wqueueStateWaitDrug; break;
						case 5: case 7: wait_state = wqueueStateWaitReExam; break;
						default: wait_state = wqueueStateWaitExam; break;
					}
					item.wqueue = util.mockWqueue({visit_id: item.visit.visit_id, wait_state: wait_state});
					if( wait_state !== wqueueStateWaitCashier && wait_state !== wqueueStateWaitDrug ){
						ansItems.push(item);
					}
				});
				var wqueueList = list.map(function(item){ return item.wqueue; });
				insertWqueueList(conn, wqueueList, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = ansItems.map(function(item){
				var o = util.assign({}, item.wqueue);
				return util.assign(o, item.patient);
			});
			db.listWqueueForExam(conn, function(err, result){
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