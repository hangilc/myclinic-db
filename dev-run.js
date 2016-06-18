var db = require("./index.js");

var config = {
    user: process.env.MYCLINIC_DB_USER,
    password: process.env.MYCLINIC_DB_PASS,
    database: "myclinic",
    dateStrings: true
};

var dbPool = new db.Pool(config);

dbPool.withConnection(function(conn){
	db.query(conn, "select * from patient where patient_id = ?", [199])
	.then(function(list){
		console.log(list);
	})
})