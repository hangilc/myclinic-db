var expect = require("chai").expect;
var db = require("../index");
var setup = require("./setup");
var conti = require("conti");
var util = require("./util");

var wqueueStateWaitExam = util.WqueueStateWaitExam;
var wqueueStateInExam = util.WqueueStateInExam;
var wqueueStateWaitCashier = util.WqueueStateWaitCashier;
var wqueueStateWaitDrug = util.WqueueStateWaitCashier;
var wqueueStateWaitReExam = util.WqueueStateWaitCashier;
var wqueueStateWaitAppoint = util.WqueueStateWaitCashier;

function insertPatients(conn, patients, cb){
	conti.exec([
		function(done){
			conti.forEach(patients, function(patient, done){
				db.insertPatient(conn, patient, done);
			}, done);
		}
	], cb);
}

function insertVisits(conn, visits, cb){
	conti.exec([
		function(done){
			conti.forEach(visits, function(visit, cb){
				db.insertVisit(conn, visit, cb);
			}, done)
		}
	], cb);
}

function insertWqueueList(conn, wqueueList, cb){
	conti.exec([
		function(done){
			conti.forEach(wqueueList, function(wqueue, cb){
				db.insertWqueue(conn, wqueue, cb);
			}, done)
		}
	], cb);
}

function resetTables(done){
	util.withConnect(function(conn, done){
		util.initTables(conn, ["wqueue"], ["patient", "visit"], done);
	}, done);
}

describe("Testing listFullWqueue", function(){
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
		db.listFullWqueue(conn, function(err, result){
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
			db.listFullWqueue(conn, function(err, result){
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
			db.listFullWqueue(conn, function(err, result){
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

describe("Testing listFullWqueueForExam", function(){
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
		db.listFullWqueueForExam(conn, function(err, result){
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
			db.listFullWqueueForExam(conn, function(err, result){
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
			db.listFullWqueueForExam(conn, function(err, result){
				if( err ){
					done(err);
					return;
				}
				expect(result).eql(ans);
				done();
			})
		})
	});

	it("multiple visits for single patient", function(done){
		var patients = util.range(0, 10).map(function(i){
			var p = util.mockPatient();
			p.last_name += i;
			return p;
		});
		var items = [];
		conti.exec([
			function(done){
				insertPatients(conn, patients, done);
			},
			function(done){
				patients.forEach(function(patient, i){
					var n = 1;
					if( i === 2 ){
						n = 2;
					} else if( i === 6 ){
						n = 3;
					}
					for(var j = 0; j<n; j++){
						items.push({
							patient: patient,
							visit: util.mockVisit({patient_id: patient.patient_id})
						});
					}
				});
				var visits = items.map(function(item){ return item.visit; });
				insertVisits(conn, visits, done);
			},
			function(done){
				items.forEach(function(item){
					item.wqueue = util.mockWqueue({visit_id: item.visit.visit_id, wait_state: wqueueStateWaitExam});
				});
				[2, 5].forEach(function(i){
					items[i].wqueue.wait_state = wqueueStateWaitDrug;
				});
				[8].forEach(function(i){
					items[i].wqueue.wait_state = wqueueStateWaitReExam;
				});
				[6].forEach(function(i){
					items[i].wqueue.wait_state = wqueueStateWaitCashier;
				});
				var wqueueList = items.map(function(item){ return item.wqueue; });
				insertWqueueList(conn, wqueueList, done);
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			var ans = items.filter(function(item){ 
				return item.wqueue.wait_state !== wqueueStateWaitDrug && item.wqueue.wait_state !== wqueueStateWaitCashier; 
			}).map(function(item){
				var o = util.assign({}, item.wqueue);
				return util.assign(o, item.patient);
			})
			db.listFullWqueueForExam(conn, function(err, result){
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