const fs = require('fs');
const path = require('path');
const javaConverter = require('./javaConverter.js')

const dirName = __dirname + '/json';

fs.readdir(dirName, (err, fileNames) => {
	
	if (err) {
		console.log(err);
		throw err;
	} 

	fileNames.forEach((fileName) => {
		let fileToRead = dirName + '/' + fileName;
		console.log('Reading ... ' + fileToRead);

		readFile('/' + fileToRead)
		.then((result) => {
			convertToJava(result, fileName);
		})
		.catch(err => console.log(err));
	});
});

const readFile = (file) => {

	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		})
	});
	
}

const writeFile = (className, data) => {

	let fileName = className + '.java';

	return new Promise((resolve, reject) => {
		fs.writeFile(fileName, data, (err) => {
			if (err) {
				reject(err);
			} else {
				console.log('Data written to fileName\n' + data);
				resolve();
			}
		})
	});

}

const convertToJava = (obj, className) => {

	Object.keys(obj).forEach((key) => {

		if (obj[key] == null) {
			console.log(key, 'is NULL');
		} else if (obj[key] instanceof Array) {
			console.log(obj[key]);
			obj[key].forEach(e => convertArrayElementToJava(e, key));
		} else if (typeof obj[key] == 'object') {
			convertToJava(obj[key]);
		} else {
			console.log(key, typeof obj[key]);
		}

	});

}

const convertArrayElementToJava = (element, arrName) => {

	if (element instanceof Array) {
		element.forEach(e => convertArrayElementToJava(e, arrName));
	} else if (typeof element == 'object') {
		convertToJava(element, arrName);
	}

}

