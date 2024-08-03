const Notification = require('../models/Notification') ;
const mongoose = require('mongoose') ;

const getNotificationsByUser = async (req,res,next) => {
    try {
     
     const connected_id =   mongoose.Types.ObjectId.createFromHexString(req.connected_id) ;
    //  const notifications =  await Notification.find({ $or : [{issuer : connected_id }, {receivers : {$elemMatch :  { $eq : connected_id}} }] }).sort({createdAt : -1}) ;
     const notifications =  await Notification.aggregate([
        {
            $match: {
                $or: [
                    { issuer: connected_id },
                    { receivers :   connected_id }
                ]
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);
     
     if(!notifications) {
        res.senStatus(204) ;
     }
     else res.status(200).json({notifications})

    }catch(err) {
        next(err) ;
    }
}

module.exports = {getNotificationsByUser} ;

