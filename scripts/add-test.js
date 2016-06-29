var gulp = require("gulp");
var rename = require("gulp-rename");
var inquirer = require("inquirer");
var fs = require("fs");

var dst = "test";

inquirer.prompt([
	{
		type: "input",
		name: "output",
		message: "Name of the test",
		deafult: "unit",
		validate: function(ans){
			return ans !== "";
		}
	}
]).then(function(answers){
	var output = answers.output;
	var outfile = output + ".js";
	try{
		fs.statSync(dst + "/" + outfile);
		throw new Error(dst + "/" + outfile + " already exists")
	} catch (err) {
		if( err.code !== 'ENOENT' ){
			console.log(err);
			throw err;
		}
	}

	console.log("creating " + dst + "/" + outfile);
	gulp.src(__dirname + "/add-test-template.js")
		.pipe(rename(outfile))
		.pipe(gulp.dest(dst));
})


