require('dotenv/config');

const docker = require('./src/docker');
const database = require('./src/database');

async function main() {
    const containerId = docker.up();
    console.log(`Database running on container ${containerId}`);
    await database();
    console.log('Database ready to usage');
}

main().catch(console.error);