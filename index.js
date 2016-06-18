var mysql = require("mysql");

function Pool(config){
	this.pool = mysql.createPool(config);
}

Pool.prototype.getConnection = function(cb){
	this.pool.getConnection(function(err, conn){
		if( err ){
			throw err;
		}
		cb(conn);
	});
};

Pool.prototype.withConnection = function(cb){
	this.pool.getConnection(function(err, conn){
		if( err ){
			throw err;
		}
		try {
			cb(conn);
		}
		finally {
			conn.release();
		}
	})
}

Pool.prototype.dispose = function(){
	this.pool.end(function(err){
		if( err ){
			throw err;
		}
	});
}

exports.Pool = Pool;

function query(conn, sql, args){
	if( args == null ) args = [];
    return new Promise(function(resolve, reject){
        conn.query(sql, args, function(err, results){
            if( err ){
                reject(err);
                return;
            }
            resolve(results);
        })
    })
}
exports.query = query;

function find(conn, sql, args){
    if( args == null ) args = [];
    return new Promise(function(resolve, reject){
        conn.query(sql, args, function(err, results){
            var len;
            if( err ){
                reject(err);
                return;
            }
            len = results.length;
            if( len === 0 ){
                resolve(null);
            } else if( len === 1 ){
                resolve(results[0]);
            } else {
                reject("multiple rows found for get");
            }
        })
    })
}
exports.find = find;

function get(conn, sql, args){
	return find(conn, sql, args)
		.then(function(result){
			if( result === null ){
				throw new Error("cannot find row");
			}
			return result;
		})
}
exports.get = get;

function getValue(conn, sql, args){
	return get(conn, sql, args)
	.then(function(row){
		for(var name in row){
			return row[name];
		}
	});
}
exports.getValue = getValue;

function insert(conn, sql, args){
    if( args == null ) args = [];
    return new Promise(function(resolve, reject){
        conn.query(sql, args, function(err, result){
            if( err ){
                reject(err);
                return;
            }
            resolve(result.insertId);
        })
    })
}
exports.insert = insert;

function exec(conn, sql, args){
    if( args == null ) args = [];
    return new Promise(function(resolve, reject){
        conn.query(sql, args, function(err, result){
            if( err ){
                reject(err);
                return;
            }
            resolve(result.affectedRows);
        })
    })
}
exports.exec = exec;

function withTransaction(conn, fn){
    return new Promise(function(resolve, reject){
        conn.beginTransaction(function(err){
            if( err ){
                reject(err);
                return;
            }
            console.log("start transaction");
            fn().then(function(value){
                conn.commit(function(err){
                    if( err ){
                        reject(err);
                        return;
                    }
                    console.log("commit");
                    resolve(value);
                });
            }, function(err){
                conn.rollback(function(){
                    console.log("rollback");
                    reject(err);
                })
            });
        });
    });
}
exports.withTransaction = withTransaction;

function recentVisits(conn){
    return query(conn, "select p.patient_id, p.last_name, p.first_name, p.last_name_yomi, p.first_name_yomi, " + 
        " v.visit_id " + 
        " from visit v, patient p where v.patient_id = p.patient_id order by visit_id desc limit 30");	
}
exports.recentVisits = recentVisits;

function getPatient(conn, patient_id){
	return get(conn, "select * from patient where patient_id = ?", [patient_id]);
}
exports.getPatient = getPatient;

function calcVisits(conn, patient_id){
    return getValue(conn, "select count(*) from visit where patient_id = ?", [patient_id]);
}
exports.calcVisits = calcVisits;

function extendVisitWithTexts(conn, visit){
    return query(conn, "select * from visit_text where visit_id = ? order by text_id", [visit.visit_id])
    .then(function(texts){
        visit.texts = texts;
    });
}

function extendVisitWithShahokokuho(conn, visit){
    if( visit.shahokokuho_id == 0 ){
        visit.shahokokuho = null;
        return Promise.resolve(null);
    } else {
        return get(conn, "select * from hoken_shahokokuho where shahokokuho_id = ?", [visit.shahokokuho_id])
        .then(function(hoken){
            visit.shahokokuho = hoken;
        });
    }
}

function extendVisitWithKoukikourei(conn, visit){
    if( visit.koukikourei_id == 0 ){
        visit.koukikourei = null;
        return Promise.resolve(null);
    } else {
        return get(conn, "select * from hoken_koukikourei where koukikourei_id = ?", [visit.koukikourei_id])
        .then(function(hoken){
            visit.koukikourei = hoken;
        });
    }
}

function extendVisitWithRoujin(conn, visit){
    if( visit.roujin_id == 0 ){
        visit.roujin = null;
        return Promise.resolve(null);
    } else {
        return get(conn, "select * from hoken_roujin where roujin_id = ?", [visit.roujin_id])
        .then(function(hoken){
            visit.roujin = hoken;
        });
    }
}

function extendVisitWithKouhiIter(conn, visit, kouhi_id){
    if( kouhi_id == 0 ){
        return Promise.resolve(visit);
    }
    return get(conn, "select * from kouhi where kouhi_id = ?", [kouhi_id]).then(function(kouhi){
        visit.kouhi_list.push(kouhi);
        return visit;
    })
}

function extendVisitWithKouhi(conn, visit){
    visit.kouhi_list = [];
    return extendVisitWithKouhiIter(conn, visit, visit.kouhi_1_id).then(function(){
        return extendVisitWithKouhiIter(conn, visit, visit.kouhi_2_id)
    }).then(function(){
        return extendVisitWithKouhiIter(conn, visit, visit.kouhi_3_id)
    });
}

function extendVisitWithHoken(conn, visit){
	return extendVisitWithShahokokuho(conn, visit)
		.then(function(){
			return extendVisitWithKoukikourei(conn, visit);
		})
		.then(function(){
			return extendVisitWithRoujin(conn, visit);
		})
		.then(function(){
			return extendVisitWithKouhi(conn, visit);
		})
}

function extendVisitWithDrugs(conn, visit){
    var sql;
    sql = "select d.*, m.* from visit_drug d, iyakuhin_master_arch m " + 
    " where d.visit_id = ? " + 
    " and m.iyakuhincode = d.d_iyakuhincode " +
    " and m.valid_from <= date(?) " +
    " and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(?)) " +
    " order by drug_id";
    return query(conn, sql, [visit.visit_id, visit.v_datetime, visit.v_datetime])
    .then(function(drugs){
        visit.drugs = drugs;
    });
}

function extendVisitWithShinryou(conn, visit){
    var sql;
    sql = "select s.*, m.* from visit_shinryou s, shinryoukoui_master_arch m " + 
        " where s.visit_id = ? " + 
        " and m.shinryoucode = s.shinryoucode " +
        " and m.valid_from <= date(?) " +
        " and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(?)) " +
        " order by s.shinryoucode";
    return query(conn, sql, [visit.visit_id, visit.v_datetime, visit.v_datetime])
    .then(function(shinryouList){
        visit.shinryou_list = shinryouList;
        return visit;
    });
}

function extendConductWithGazouLabel(conn, conduct){
    return find(conn, "select * from visit_gazou_label where visit_conduct_id = ?", [conduct.id])
        .then(function(gazou){
            conduct.gazou_label = gazou ? gazou.label : "";
            return conduct;
        });
}

function extendConductWithShinryou(conn, conduct, at){
    var sql;
    sql = "select s.*, m.* from visit_conduct_shinryou s, shinryoukoui_master_arch m " +
        " where s.visit_conduct_id = ? " +
        " and m.shinryoucode = s.shinryoucode " + 
        " and m.valid_from <= date(?) " +
        " and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(?)) " +
        " order by id";
    return query(conn, sql, [conduct.id, at, at])
        .then(function(list){
            conduct.shinryou_list = list;
        });
}

function extendConductWithDrugs(conn, conduct, at){
    var sql;
    sql = "select d.*, m.* from visit_conduct_drug d, iyakuhin_master_arch m " +
        " where d.visit_conduct_id = ? " +
        " and m.iyakuhincode = d.iyakuhincode " + 
        " and m.valid_from <= date(?) " +
        " and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(?)) " +
        " order by id";
    return query(conn, sql, [conduct.id, at, at])
        .then(function(list){
            conduct.drugs = list;
        });
}

function extendConductWithKizai(conn, conduct, at){
    var sql;
    sql = "select k.*, m.* from visit_conduct_kizai k, tokuteikizai_master_arch m " +
        " where k.visit_conduct_id = ? " +
        " and m.kizaicode = k.kizaicode " + 
        " and m.valid_from <= date(?) " +
        " and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(?)) " +
        " order by id";
    return query(conn, sql, [conduct.id, at, at])
        .then(function(list){
            conduct.kizai_list = list;
            return conduct;
        });
}

function extendConduct(conn, conduct, visit){
	var at = visit.v_datetime;
	return extendConductWithGazouLabel(conn, conduct)
	.then(function(){
		return extendConductWithShinryou(conn, conduct, at);
	})
	.then(function(){
		return extendConductWithDrugs(conn, conduct, at);
	})
	.then(function(){
		return extendConductWithKizai(conn, conduct, at);
	})
}

function extendVisitWithConducts(conn, visit){
    var sql;
    sql = "select * from visit_conduct where visit_id = ? order by id";
    return query(conn, sql, [visit.visit_id]).then(function(conducts){
        visit.conducts = conducts;
        return Promise.all(conducts.map(function(conduct){
            return extendConduct(conn, conduct, visit);
        }));
    })
}

function extendVisitWithCharge(conn, visit){
    return find(conn, "select * from visit_charge where visit_id = ?", [visit.visit_id])
        .then(function(charge){
            visit.charge = charge;
        })
}

function extendVisit(conn, visit){
	return extendVisitWithTexts(conn, visit)
		.then(function(){
			return extendVisitWithHoken(conn, visit);
		})
		.then(function(){
			return extendVisitWithDrugs(conn, visit);
		})
		.then(function(){
			return extendVisitWithShinryou(conn, visit);
		})
		.then(function(){
			return extendVisitWithConducts(conn, visit);
		})
		.then(function(){
			return extendVisitWithCharge(conn, visit);
		})
		.then(function(){
			return visit;
		})
}

function listFullVisits(conn, patient_id, offset, n){
    return query(conn, "select * from visit where patient_id = ? order by visit_id desc limit ?,?",
        [patient_id, offset, n]).then(function(visits){
            return Promise.all(visits.map(function(visit){ return extendVisit(conn, visit); }))
        });
}
exports.listFullVisits = listFullVisits;

function getVisit(conn, visit_id){
	return get(conn, "select * from visit where visit_id = ?", [visit_id]);
}
exports.getVisit = getVisit;

function getFullVisit(conn, visit_id){
	var visit;
	return getVisit(conn, visit_id)
		.then(function(visit_){
			visit = visit_;
			return extendVisit(conn, visit);
		})
		.then(function(){
			return visit;
		})
}
exports.getFullVisit = getFullVisit;

function extendDiseaseWithMaster(conn, disease){
    var sql;
    sql = "select a.*, m.* from disease_adj a, shuushokugo_master m " + 
        " where a.disease_id = ? and a.shuushokugocode = m.shuushokugocode " + 
        " order by disease_adj_id";
    return query(conn, sql, [disease.disease_id]).then(function(list){
        disease.adj_list = list;
        return disease;
    });
}

function listCurrentDiseasesWithMaster(conn, patientId){
    var sql;
    sql = "select d.*, m.* from disease d, shoubyoumei_master_arch m " + 
        " where d.patient_id = ? and d.end_reason = 'N' " + 
        " and d.shoubyoumeicode = m.shoubyoumeicode " +
        " and m.valid_from <= d.start_date " +
        " and (m.valid_upto = '0000-00-00' or m.valid_upto >= d.start_date) " +
        " order by disease_id";
    return query(conn, sql, [patientId]);
}

function listCurrentFullDiseases(conn, patientId){
    return listCurrentDiseasesWithMaster(conn, patientId)
        .then(function(diseases){
            return Promise.all(diseases.map(extendDiseaseWithMaster.bind(null, conn)))
        });
}
exports.listCurrentFullDiseases = listCurrentFullDiseases;

function listAllDiseasesWithMaster(conn, patientId){
    var sql;
    sql = "select d.*, m.* from disease d, shoubyoumei_master_arch m " + 
        " where d.patient_id = ? " + 
        " and d.shoubyoumeicode = m.shoubyoumeicode " +
        " and m.valid_from <= d.start_date " +
        " and (m.valid_upto = '0000-00-00' or m.valid_upto >= d.start_date) " +
        " order by disease_id";
    return query(conn, sql, [patientId]);
}

function listAllFullDiseases(conn, patientId){
    return listAllDiseasesWithMaster(conn, patientId)
        .then(function(diseases){
            return Promise.all(diseases.map(extendDiseaseWithMaster.bind(null, conn)))
        });
}
exports.listAllFullDiseases = listAllFullDiseases;

function listAvailableShahokokuho(conn, patientId, at){
    var sql;
    sql = "select * from hoken_shahokokuho where patient_id = ? " +
        " and valid_from <= date(?) " +
        " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) " +
        " order by shahokokuho_id ";
    return query(conn, sql, [patientId, at, at]);
}

function listAllShahokokuho(conn, patientId){
    var sql = "select * from hoken_shahokokuho where patient_id = ? order by shahokokuho_id";
    return query(conn, sql, [patientId]);
}

function listAvailableKoukikourei(conn, patientId, at){
    var sql;
    sql = "select * from hoken_koukikourei where patient_id = ? " +
        " and valid_from <= date(?) " +
        " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) " +
        " order by koukikourei_id ";
    return query(conn, sql, [patientId, at, at]);
}

function listAllKoukikourei(conn, patientId){
    var sql = "select * from hoken_koukikourei where patient_id = ? order by koukikourei_id";
    return query(conn, sql, [patientId]);
}

function listAllRoujin(conn, patientId){
    var sql = "select * from hoken_roujin where patient_id = ? order by roujin_id";
    return query(conn, sql, [patientId]);
}

function listAvailableKouhi(conn, patientId, at){
    var sql;
    sql = "select * from kouhi where patient_id = ? " +
        " and valid_from <= date(?) " +
        " and (valid_upto = '0000-00-00' or valid_upto >= date(?)) " +
        " order by kouhi_id ";
    return query(conn, sql, [patientId, at, at]);
}

function listAllKouhi(conn, patientId){
    var sql = "select * from kouhi where patient_id = ? order by kouhi_id";
    return query(conn, sql, [patientId]);
}

function listAvailableHoken(conn, patientId, at){
    var obj = {};
    return listAvailableShahokokuho(conn, patientId, at)
        .then(function(list){
            obj.shahokokuho_list = list;
            return listAvailableKoukikourei(conn, patientId, at);
        })
        .then(function(list){
            obj.koukikourei_list = list;
            return listAvailableKouhi(conn, patientId, at);
        })
        .then(function(list){
            obj.kouhi_list = list;
            return obj;
        });
}
exports.listAvailableHoken = listAvailableHoken;

function listAllHoken(conn, patientId){
    var obj = {};
    return listAllShahokokuho(conn, patientId)
        .then(function(list){
            obj.shahokokuho_list = list;
            return listAllKoukikourei(conn, patientId);
        })
        .then(function(list){
            obj.koukikourei_list = list;
            return listAllRoujin(conn, patientId);
        })
        .then(function(list){
            obj.roujin_list = list;
            return listAllKouhi(conn, patientId);
        })
        .then(function(list){
            obj.kouhi_list = list;
            return obj;
        });
}
exports.listAllHoken = listAllHoken;

function enterText(conn, visitId, content){
    var sql;
    sql = "insert into visit_text set visit_id = ?, content = ?";
    return insert(conn, sql, [visitId, content]);
}
exports.enterText = enterText;

function getText(conn, textId){
    var sql;
    sql = "select * from visit_text where text_id = ?";
    return get(conn, sql, [textId]);
}
exports.getText = getText;

function updateText(conn, textId, content){
    var sql;
    sql = "update visit_text set content = ? where text_id = ?";
    return exec(conn, sql, [content, textId])
    .then(function(affected){
    	if( affected !== 1 ){
    		throw new Error("update text failed");
    	}
    	return true;
    })
}
exports.updateText = updateText;

function deleteText(conn, textId){
    var sql;
    sql = "delete from visit_text where text_id = ?";
    return exec(conn, sql, [textId])
    .then(function(affected){
    	if( affected !== 1 ){
    		throw new Error("delete text failed");
    	}
    	return true;
    })
}
exports.deleteText = deleteText;

function updateVisitHoken(conn, visitId, shahokokuhoId, koukikoureiId, kouhi1Id, kouhi2Id, kouhi3Id){
    var sql;
    sql = "update visit set shahokokuho_id = ?, koukikourei_id = ?, kouhi_1_id = ?, " +
        " kouhi_2_id = ?, kouhi_3_id = ? where visit_id = ?";
    return exec(conn, sql, [shahokokuhoId, koukikoureiId, kouhi1Id, kouhi2Id, kouhi3Id, visitId])
    .then(function(affected){
    	if( affected !== 1 ){
    		throw new Error("update visit hoken failed");
    	}
    	return true;
    })
}
exports.updateVisitHoken = updateVisitHoken;





