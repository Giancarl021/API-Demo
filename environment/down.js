require('dotenv/config');
const docker = require('./src/docker');
const volumes = require('./src/volumes');

const imageId = docker.down();

if (imageId) console.log(`Database stopped on container ${imageId}`);
else console.log('No container running');

if (volumes()) console.log('Volume destroyed');