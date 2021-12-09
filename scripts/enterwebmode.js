#!/bin/node
const fs = require('fs');

//read the content of the json file
const baseEnvs = require('../package.json');
const fileContent = require(`../package.prod.json`);
const name = fileContent.name;
delete fileContent.name;
const newFile = { name, ...baseEnvs, ...fileContent };
//copy the json inside the env.json file
fs.writeFileSync('package.json', JSON.stringify(newFile, undefined, 2));
