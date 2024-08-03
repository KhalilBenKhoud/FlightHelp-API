require('dotenv').config() ;
const express = require('express') ;
const connectDB = require('./config/dbConnection')
const mongoose = require('mongoose')
const router = require('./routers/index.router')
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/credentials');
const cors = require('cors')
const http = require('http')
const  {  socket_factory , io } = require('./config/socket-factory') ;
const PORT = process.env.PORT || 3500 ;
const User = require('./models/User') ;

const app = express() ;

app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use(cookieParser())

app.use(credentials)

app.use('/api/v1',router) ;

app.use(errorHandler)


connectDB() ;

const server = http.createServer(app) ;


socket_factory(server) ;

socket_singleton = io() ;

// link users with their sockets ids
const users = new Map() ;

socket_singleton.on('connection',(socket) => {
      console.warn('socket connected') ;
      socket.emit('message',"Welcome to Chat App") ;
      
      socket.on('userConnected',(email) => {
         socket.broadcast.emit('message',`${email} connected !`) ;
         users.set(socket.id,email) ;
         console.log(users) ;
      })

      socket.on('disconnect',() => {
         socket.broadcast.emit('message',`${users.get(socket.id)} disconnected !`) ;
         users.delete(socket.id) ;
      })

      socket.on('notification', async (data) => {
         const emails = (await User.find({_id : {$in : data.receivers}},{email : 1})).map((element) => element.email) ;
         console.log(emails) ;
         const socketIds = Array.from(users.keys()).filter(key => emails.includes(users.get(key))) ;
         socket_singleton.to(socketIds).emit('notification',data);
      })
})



mongoose.connection.once('open', async () => {
   
   server.listen(PORT,() => console.log(`server listening on port ${PORT}`) ) ;  
})





