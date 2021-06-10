#!/bin/node
const fs = require('fs');

//read the content of the json file
const baseEnvs = require('../package.json');
delete baseEnvs.name;
delete baseEnvs.peerDependencies;
delete baseEnvs.dependencies;
//copy the json inside the env.json file
fs.writeFileSync('package.base.json', JSON.stringify(baseEnvs, undefined, 2));
