"use strict";

exports.recentVisits = function(conn, n, cb){
    var sql = "select p.patient_id, p.last_name, p.first_name, p.last_name_yomi, p.first_name_yomi, " + 
        " v.visit_id " + 
        " from visit v, patient p where v.patient_id = p.patient_id order by visit_id desc limit ?";	
    conn.query(sql, [+n], cb);
};