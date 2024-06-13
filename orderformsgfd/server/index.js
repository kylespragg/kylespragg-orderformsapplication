const server = require('./api/server');

const HOST = 'localhost';
const PORT = 3001;

server.listen(PORT, () => console.log(`Server running at ${HOST}:${PORT}`)); //takes an argument and a callback
