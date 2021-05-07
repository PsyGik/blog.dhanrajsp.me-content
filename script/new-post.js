#!/usr/bin/env node

const fs = require('fs');
const DIR = './content/blog';
const componentName = process.argv[2];

if (!componentName) {
	console.error('Please supply a valid post name');
	process.exit(1);
}

const lastIndex = fs
	.readdirSync(DIR, { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory()).length;

const folderName = `${lastIndex}. ${componentName}`;
const fileName = componentName.replace(/\s+/g, '-').toLowerCase();
const directory = `${DIR}/${folderName}`;
const file = `${directory}/${fileName.concat('.md')}`;

if (fs.existsSync(folderName)) {
	console.error(`Folder ${folderName} already exists.`);
	process.exit(1);
}

const content = `---
title: "${componentName}"
author: "Dhanraj Padmashali"
tags: [""]
image: "../../images/default.jpeg"
date: "${new Date().toISOString()}"
draft: true
permalink: "${fileName}"
excerpt: ''
---
`;
try {
	console.log('Creating Post Folder: ' + folderName);
	fs.mkdir(directory, { recursive: true }, (err) => {
		if (err) throw err;
		console.log('Creating MD File', fileName);
		fs.writeFileSync(file, content);
		console.log('Success! Start Writing!');
	});

	//file written successfully
} catch (err) {
	console.error(err);
}
