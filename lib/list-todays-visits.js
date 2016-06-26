"use strict";

exports.listTodaysVisits = function(conn, cb){
    var sql = "select v.visit_id, p.patient_id, p.last_name, p.first_name, p.last_name_yomi, p.first_name_yomi " +  
        " from visit v, patient p where v.patient_id = p.patient_id and date(v.v_datetime) = date(now()) " +
        " order by v.visit_id ";
    conn.query(sql, cb);
};