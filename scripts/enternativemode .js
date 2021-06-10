#!/bin/node
const fs = require('fs');

//read the content of the json file
const baseEnvs = require('../package.base.json');
const webFileContent = require(`../package.web.json`);
const newFile = { ...baseEnvs, ...webFileContent };
//copy the json inside the env.json file
fs.writeFileSync('package.json', JSON.stringify(newFile, undefined, 2));
