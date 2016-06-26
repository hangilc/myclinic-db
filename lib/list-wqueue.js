"use strict";

exports.listWqueue = function(conn, cb){
    var sql = "select w.*, p.* from wqueue w, visit v, patient p " +
        " where w.visit_id = v.visit_id " +
        " and v.patient_id = p.patient_id " +
        " order by w.visit_id ";
    conn.query(sql, [], cb);
};

var wqueueStateWaitExam = 0;
var wqueueStateInExam = 1;
var wqueueStateWaitCashier = 2;
var wqueueStateWaitDrug = 3;
var wqueueStateWaitReExam = 4;
var wqueueStateWaitAppoint = 5;

exports.listWqueueForExam = function(conn, cb){
    var sql = "select w.*, p.* from wqueue w, visit v, patient p " +
        " where w.visit_id = v.visit_id " +
        " and v.patient_id = p.patient_id " +
        " and w.wait_state not in (?, ?)" +
        " order by w.visit_id ";
    conn.query(sql, [wqueueStateWaitCashier, wqueueStateWaitDrug], cb);
};