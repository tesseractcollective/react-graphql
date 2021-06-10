#!/bin/node
const fs = require('fs');

//read the content of the json file
const baseEnvs = require('../package.base.json');
const fileContent = require(`../package.native.json`);
const name = fileContent.name;
delete fileContent.name;
const newFile = { name, ...baseEnvs, ...fileContent };
//copy the json inside the env.json file
fs.writeFileSync('package.json', JSON.stringify(newFile, undefined, 2));
