#!/usr/bin/env node

var program = require("commander");
var fs = require("fs");
var child_process = require("child_process");

function editStoreFile(storeFileContents) {
	var newContents = storeFileContents;
	var middlewareStrings = [];
	if(program.logger) {
		newContents = newContents.replace("//<loggerImportLine>", "import logger from 'redux-logger';");	
		middlewareStrings.push("logger");
	}
	else {	
		newContents = newContents.replace("//<loggerImportLine>", "");	
	}
	if(program.thunk) {
		newContents = newContents.replace("//<thunkImportLine>", "import thunk from 'redux-thunk';");
		middlewareStrings.push("thunk");
	}
	else {
		newContents = newContents.replace("//<thunkImportLine>", "");
	}
	if(program.promise) {
		newContents = newContents.replace("//<promiseImportLine>", "import promise from 'redux-promise-middleware';");
		middlewareStrings.push("promise()");
	}
	else {
		newContents = newContents.replace("//<promiseImportLine>", "");
	}
	newContents = newContents.replace("//<middlewareLine>", "const middleware = applyMiddleware(" + middlewareStrings.toString().replace(/,/g, ", ") + ");");
	return newContents;
}

function addDependency(path, packageName, yarnExists) {

	console.log("Adding dependency '" + packageName + "'...");
	var output = "";

	if(yarnExists) {
		output = child_process.execSync("yarn add " + packageName, {cwd: path}).toString("utf8");
	}
	else {
		output = child_process.execSync("npm install --save " + packageName, {cwd: path}).toString("utf8");
	}

	console.log("Output from installation: " + output);
}

function addFileFromTemplate(path, templatePath, textProcessingFunc) {

	var templateContents = fs.readFileSync(templatePath, "utf8");
	
	if(textProcessingFunc) {
		templateContents = textProcessingFunc(templateContents);
	}

	console.log("Creating file " + path + "...");

	fs.writeFileSync(path, templateContents, function(err) {
		console.error(err);
	});
}

function checkOrMakeDir(path) {

	var dirMade = false;

	try {
		var stat = fs.statSync(path);

		if(stat.isDirectory()) {
			console.warn("WARN: The directory '" + path + "' already exists. Skipping adding files to it...")
		}
		else {	
			console.error("WARN: A file with the path '" + path + "' already exists. Cannot create a file with the same name!")
		}
	}
	catch(err) {		

		console.log("Making directory " + path + "...");

		try {
			fs.mkdirSync(path);
			console.log("Successfully created the directory '" + path + "'!");
			dirMade = true;
		}
		catch(err) {
			console.error("ERR: Failed to make directory '" + path + "'!");
		}		
	}
	return dirMade;
}

program
.version("0.1.0")
.arguments("<path>")
.option("-r, --react", "Used for React projects. Also installs and saves 'react-redux' to the project dependencies.")
.option("-l, --no-logger", "Skips installing 'redux-logger' middleware.")
.option("-t, --no-thunk", "Skips installing 'redux-thunk' middleware.")
.option("-p, --no-promise", "Skips installing 'redux-promise-middleware' middleware.")
.action(function(path) {
	try {
		var fullPath = process.cwd() + "/" + path.replace("/", "");
		var stat = fs.statSync(fullPath);

		if(stat.isDirectory()) {
			try {
				var packageStat = fs.statSync(fullPath + "/package.json");
				if(packageStat.isFile()) {	

					console.log("Adding redux to " + path + "...");
					
					var yarnExists = false;
					
					try {
						var yarnLockStat = fs.statSync(fullPath + "/yarn.lock");
						if(yarnLockStat.isFile()) {
							yarnExists = true;
							console.log("Detected yarn.lock, using yarn to install dependencies.");
						}
						else {
							console.log("No yarn.lock detected, using npm to install dependencies.");
						}
					}
					catch(err) {
						console.log("No yarn.lock detected, using npm to install dependencies.");
					}

					//Create redux directories
					
					var actionsDirMade = checkOrMakeDir(fullPath + "/actions");
					var reducersDirMade = checkOrMakeDir(fullPath + "/reducers");

					//Add boilerplate code to the redux directories					
					
					if(actionsDirMade) {
						addFileFromTemplate(fullPath + "/actions/index.js", __dirname + "/templates/actions_template.js");
					}

					if(reducersDirMade) {
						addFileFromTemplate(fullPath + "/reducers/sampleReducers.js", __dirname + "/templates/sample_reducers_template.js");
						addFileFromTemplate(fullPath + "/reducers/index.js", __dirname + "/templates/reducers_template.js");
					}

					//Add store boilerplate code in the main project directory

					addFileFromTemplate(fullPath + "/store.js", __dirname + "/templates/store_template.js", editStoreFile);
					
					//Install dependencies

					addDependency(fullPath, "redux", yarnExists);

					if(program.logger) {
						addDependency(fullPath, "redux-logger", yarnExists);
					}
					if(program.thunk) {
						addDependency(fullPath, "redux-thunk", yarnExists);
					}	
					if(program.promise) {
						addDependency(fullPath, "redux-promise-middleware", yarnExists);
					}
					if(program.react) {
						addDependency(fullPath, "react-redux", yarnExists);
						console.log("Remember to perform the following steps to integrate Redux with your React app:");
						console.log("");
						console.log("In your main component file:");
						console.log("1. import { Provider } from 'react-redux';");
						console.log("2. import store from './store';");
						console.log("3. In the component's render function, wrap the outermost component with <Provider store={store}></Provider>");
					}
				}
				else {
					console.error("ERR: '" + fullPath + "' is not a valid npm project! No package.json file found!");
				}
			}
			catch(err) {
				console.error("ERR: '" + fullPath + "' is not a valid npm project! No package.json file found!");
				console.log(err);
			}
		}
		else {
			console.error("ERR: '" + fullPath + "' is not a valid directory!");
		}
	}
	catch(err) {
		console.error("ERR: '" + fullPath + "' is not a valid directory!");
	}
})
.parse(process.argv);
