const ioClient = require('socket.io-client');

// socket client to emit notifications from the server
const socket = ioClient(process.env.SOCKET_DEV_SERVER) ;

module.exports = socket ;