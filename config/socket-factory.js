const {Server} = require('socket.io') ;

let socket_singleton = null ;

const socket_factory = (server) => {
    
    socket_singleton = new Server(server) ;
   
}

const io = () => {
    if(!socket_singleton) throw new Error('socket io not initialized !') ;
    return socket_singleton ;
}

module.exports = {io , socket_factory } ;