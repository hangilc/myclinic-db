"use strict";

exports.insertPayment = function(conn, pay, done){
	var sql = "insert into visit_payment set visit_id = ?, amount = ?, paytime = ?";
	var args = [pay.visit_id, pay.amount, pay.paytime];
	conn.query(sql, args, done);
};

exports.getPayment = function(conn, visit_id, paytime, cb){
	var sql = "select * from visit_payment where visit_id = ? and paytime = ?";
	var args = [visit_id, paytime];
	conn.query(sql, args, function(err, result){
		if( err ){
			cb(err);
			return;
		}
		if( result.length === 1 ){
			cb(undefined, result[0]);
			return;
		}
		cb("getPayment failed");
	});
};

exports.updatePayment = function(conn, pay, done){
	var sql = "update visit_payment set amount = ? where visit_id = ? and paytime = ?";
	var args = [pay.amount, pay.visit_id, pay.paytime];
	conn.query(sql, args, function(err, result){
		if( err ){
			done(err);
			return;
		}
		if( result.affectedRows === 1 ){
			done();
			return;
		}
		done("updatePayment failed");
	});
};

exports.deletePayment = function(conn, visitId, paytime, done){
	var sql = "delete from visit_payment where visit_id = ? and paytime = ?";
	var args = [visitId, paytime];
	conn.query(sql, args, function(err, result){
		if( err ){
			done(err);
			return;
		}
		if( result.affectedRows === 1 ){
			done();
			return;
		}
		done("deletePayment failed");
	});
};