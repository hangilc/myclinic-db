var db = require("./index.js");

var config = {
	host: "127.0.0.1",
    user: process.env.MYCLINIC_DB_USER,
    password: process.env.MYCLINIC_DB_PASS,
    database: "myclinic",
    dateStrings: true
};

var dbPool = new db.Pool(config);

// 2274 koukikourei
// 161 roujin
// 520 kouhi
// visit_id for conducts: 46765
// visit_id for conduct drug: 56207

dbPool.getConnection(function(conn){
	//db.listFullVisits(conn, 198, 0, 10)
	//db.getFullVisit(conn, 46765)
	//db.listCurrentFullDiseases(conn, 199)
	db.listAllFullDiseases(conn, 199)
	.then(function(result){
		console.log(JSON.stringify(result, null, 2));
		conn.release();
		dbPool.dispose();
	})
	.catch(function(err){
		console.log(err);
		conn.release();
		dbPool.dispose();
	})
})


