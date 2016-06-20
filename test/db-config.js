var config = {
	host: "127.0.0.1",
    user: process.env.MYCLINIC_DB_TEST_USER,
    password: process.env.MYCLINIC_DB_TEST_PASS,
    database: "myclinic_test",
    dateStrings: true
};

module.exports = config;