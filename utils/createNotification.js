const Notification = require('../models/Notification') ;
const socketClient = require('../config/socket-client') ;



const createNotification =  async (issuerId,title,content,receivers) => {

    const notification = await Notification.create({
        issuer : issuerId,
        title,
        content,
        receivers
    })

    socketClient.emit('notification', notification) ;
}

module.exports = createNotification ;