const { createClient } = require('redis') ;

const client = createClient({
    password: process.env.REDIS_CLIENT_PASSWORD,
    socket: {
        host: process.env.REDIS_CLIENT_HOST,
        port: process.env.REDIS_CLIENT_PORT
    }
});

client.on('error',err => console.log('Redis Client Error',err)) ;

client.connect() ;
client.on('connect',() => console.log('redis connected')) ;
 
const setValue = async (key,value) => {
   await client.set(key,JSON.stringify(value)) ;
}

const retriveValue = async (key) => {
    const value = await client.get(key) ;
<<<<<<< HEAD
    return value ? JSON.parse(value) : null;
=======
    return JSON.parse(value) ;
>>>>>>> 518a7d06a59903dfec308f5380d7d44ad6c92f63
}

module.exports = {setValue, retriveValue} ;