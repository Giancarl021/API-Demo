const { execSync: exec } = require('child_process');
const locate = require('@giancarl021/locate');

const containerImage = process.env.CONTAINER_IMAGE || 'postgres:latest';
const port = process.env.CONTAINER_PORT || 5432;
const containerName = process.env.CONTAINER_NAME || 'postgres';
const user = process.env.POSTGRES_USER || 'postgres';
const password = process.env.POSTGRES_PASSWORD || 'postgres';
const database = process.env.POSTGRES_DATABASE || 'postgres';
const volumePath = locate('volumes');

function getImages() {
    return exec(`docker ps -a -q -f "name=${containerName}"`)
        .toString('utf8')
        .split(/\r?\n/)
        .map(e => e.trim())
        .filter(Boolean);
}

module.exports = {
    up() {
        const images = getImages();

        if (images.length) return images[0];

        const id = exec(`docker run -d --rm --name "${containerName}" -p "${port}:5432" -v "${volumePath}:/var/lib/postgresql/data" -e "POSTGRES_USER=${user}" -e "POSTGRES_PASSWORD=${password}" -e "POSTGRES_DB=${database}" "${containerImage}"`)
            .toString('utf8')
            .trim();

        return id;
    },

    down() {
        const [image] = getImages();
        
        if (!image) return null;

        return exec(`docker stop "${image}"`)
            .toString('utf8')
            .trim();
    }
}