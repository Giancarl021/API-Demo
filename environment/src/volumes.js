const fs = require('fs');
const locate = require('@giancarl021/locate');

const volumePath = locate('volumes');

module.exports = function () {
    const exists = fs.existsSync(volumePath);
    if (exists) fs.rmSync(volumePath, { recursive: true, force: true });

    return exists;
}