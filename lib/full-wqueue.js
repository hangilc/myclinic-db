"use strict";

var util = require("./util");

exports.listFullWqueue = function(conn, cb){
    var sql = "select w.*, p.* from wqueue w, visit v, patient p " +
        " where w.visit_id = v.visit_id " +
        " and v.patient_id = p.patient_id " +
        " order by w.visit_id ";
    conn.query(sql, [], cb);
};

exports.listFullWqueueForExam = function(conn, cb){
    var sql = "select w.*, p.* from wqueue w, visit v, patient p " +
        " where w.visit_id = v.visit_id " +
        " and v.patient_id = p.patient_id " +
        " and w.wait_state not in (?, ?)" +
        " order by w.visit_id ";
    conn.query(sql, [util.WqueueStateWaitCashier, util.WqueueStateWaitDrug], cb);
};