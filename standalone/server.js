require('dotenv/config');
const app = require('./src/app');

// Use the port configured in the Environment Variable PORT or default to 3000
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`));