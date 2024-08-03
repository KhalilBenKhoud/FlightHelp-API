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
    return JSON.parse(value) ;
}

module.exports = {setValue, retriveValue} ;