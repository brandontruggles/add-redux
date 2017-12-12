#!/usr/bin/env node

var program = require("commander");
var fs = require("fs");
var child_process = require("child_process");
var chalk = require("chalk");

function editStoreFile(storeFileContents) {
	var newContents = storeFileContents;
	var middlewareStrings = [];
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
	if(program.logger) {
		newContents = newContents.replace("//<loggerImportLine>", "import logger from 'redux-logger';");	
		middlewareStrings.push("logger");
	}
	else {	
		newContents = newContents.replace("//<loggerImportLine>", "");	
	}
	newContents = newContents.replace("//<middlewareLine>", "const middleware = applyMiddleware(" + middlewareStrings.toString().replace(/,/g, ", ") + ");");
	return newContents;
}

function addDependency(path, packageName, yarnExists) {

	console.log(chalk.cyan("Adding dependency '" + packageName + "'..."));
	var output = "";

	if(yarnExists) {
		output = child_process.execSync("yarn add " + packageName, {cwd: path}).toString("utf8");
	}
	else {
		output = child_process.execSync("npm install --save " + packageName, {cwd: path}).toString("utf8");
	}

	console.log(chalk.cyan("Output from installation: " + output));
}

function addFileFromTemplate(path, templatePath, textProcessingFunc) {

	var templateContents = fs.readFileSync(templatePath, "utf8");
	
	if(textProcessingFunc) {
		templateContents = textProcessingFunc(templateContents);
	}

	console.log(chalk.cyan("Creating file " + path + "..."));

	fs.writeFileSync(path, templateContents, function(err) {
		console.error(err);
	});
}

function checkOrMakeDir(path) {

	var dirMade = false;

	try {
		var stat = fs.statSync(path);

		if(stat.isDirectory()) {
			console.warn(chalk.yellow("WARN: The directory '" + path + "' already exists. Skipping adding files to it..."));
		}
		else {	
			console.error(chalk.yellow("WARN: A file with the path '" + path + "' already exists. Cannot create a file with the same name!"));
		}
	}
	catch(err) {		

		console.log(chalk.cyan("Making directory " + path + "..."));

		try {
			fs.mkdirSync(path);
			console.log(chalk.green("Successfully created the directory '" + path + "'!"));
			dirMade = true;
		}
		catch(err) {
			console.error(chalk.red("ERR: Failed to make directory '" + path + "'!"));
		}		
	}
	return dirMade;
}

program
.version("0.3.0")
.arguments("<path>")
.option("-r, --react", "Installs and saves 'react-redux' to the project dependencies. Also prompts the user with basic steps to integrate Redux with React.")
.option("-l, --no-logger", "Skips installing 'redux-logger' middleware.")
.option("-t, --no-thunk", "Skips installing 'redux-thunk' middleware.")
.option("-p, --no-promise", "Skips installing 'redux-promise-middleware' middleware.")
.option("-e, --examples", "Adds an 'redux_examples/' directory to the project root. This directory includes examples for integrating redux with different types of projects.")
.action(function(path) {
	try {
		var fullPath = process.cwd() + "/" + path.replace("/", "");
		var stat = fs.statSync(fullPath);

		if(stat.isDirectory()) {
			try {
				var packageStat = fs.statSync(fullPath + "/package.json");
				if(packageStat.isFile()) {	

					console.log(chalk.cyan("Adding redux to " + path + "..."));
					
					var yarnExists = false;
					
					try {
						var yarnLockStat = fs.statSync(fullPath + "/yarn.lock");
						if(yarnLockStat.isFile()) {
							yarnExists = true;
							console.log(chalk.cyan("Detected yarn.lock, using yarn to install dependencies."));
						}
						else {
							console.log(chalk.cyan("No yarn.lock detected, using npm to install dependencies."));
						}
					}
					catch(err) {
						console.log(chalk.cyan("No yarn.lock detected, using npm to install dependencies."));
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

					if(program.examples) {
						var examplesDirMade = checkOrMakeDir(fullPath + "/redux_examples");
						if(examplesDirMade) {
							var reactDirMade = checkOrMakeDir(fullPath + "/redux_examples/react_example");
							if(reactDirMade) {
								addFileFromTemplate(fullPath + "/redux_examples/react_example/App.js", __dirname + "/templates/react_example_template.js");
								addFileFromTemplate(fullPath + "/redux_examples/react_example/TestComponent.js", __dirname + "/templates/react_example_component_template.js");
							}
						}
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
						console.log(chalk.green("Remember to perform the following steps to successfully integrate Redux with your React app (assuming you are using ES6 syntax):"));
						console.log("");
						console.log(chalk.green("In your main file:"));
						console.log(chalk.green("1. import { Provider } from 'react-redux';"));
						console.log(chalk.green("2. import store from './store';"));
						console.log(chalk.green("3. Wrap the outermost component with <Provider store={store}></Provider>"));
						console.log("");
						console.log(chalk.green("In your individual components:"));
						console.log(chalk.green("1. import { connect } from 'react-redux';"));
						console.log(chalk.green("2. import { <actionNames> } from 'actions';"));
						console.log(chalk.green("3. Create const mapStateToProps = (state) => { return {propName: state.reducerName.variableName} }"));
						console.log(chalk.green("4. Create const mapDispatchToProps = (dispatch) => { return {propName: () => { dispatch(actionFunc()) }} }"));
						console.log(chalk.green("5. Insert the mapped props and actions into your component's render() function."));
						console.log(chalk.green("6. Wrap the component class with the connect(mapStateToProps, mapDispatchToProps)(Component) function and export the resulting component."));
						
					}
				}
				else {
					console.error(chalk.red("ERR: '" + fullPath + "' is not a valid npm project! No package.json file found!"));
				}
			}
			catch(err) {
				console.error(chalk.red("ERR: '" + fullPath + "' is not a valid npm project! No package.json file found!"));
			}
		}
		else {
			console.error(chalk.red("ERR: '" + fullPath + "' is not a valid directory!"));
		}
	}
	catch(err) {
		console.error(chalk.red("ERR: '" + fullPath + "' is not a valid directory!"));
	}
})
.parse(process.argv);
