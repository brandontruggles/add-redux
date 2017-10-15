var fs = require("fs");
var rimraf = require("rimraf");
var child_process = require("child_process");

console.log("Erasing the 'example_project' directory...");
rimraf.sync(__dirname + "/example_project");
console.log("Creating the 'example_project' directory...");
fs.mkdirSync(__dirname + "/example_project");
console.log("Running 'npm init --yes' in the 'example_project' directory...");

var output = "";

output = child_process.execSync("npm init --yes", {cwd: __dirname + "/example_project"}).toString("utf8");
console.log(output);
console.log("Running 'add-redux example_project/'...");
output = child_process.execSync("add-redux -r example_project/").toString("utf8");
console.log(output);
