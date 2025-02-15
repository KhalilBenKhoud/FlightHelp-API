
const ticketsCountByStatus = (priority) => {
    const pipeline = [
        {
            $match : {
      
            }
        },
        {
            $group : {
                _id : '$status',  
                count : { $count : {} }
            }
        }
    ]

    if(priority) pipeline[0].$match.priority = priority ;
    return pipeline ;
}


const ticketsByUser = (userId,status,priority) => {
    const pipeline = [
        {
            $match : {
                createdBy : userId
            }
        },
        {
            $sort : {
                createdAt : -1
            }
        }
    ]
    if(status) pipeline[0].$match.status = status ;
    if(priority) pipeline[0].$match.priority = priority ;
    return pipeline ;
}

const averageNumberOfTicketsPerUser = () => {
    const pipeline = [
        {
            $group: {
                _id: "$createdBy",  
                ticketCount: { $sum: 1 }  
            }
        },
        {
            $group: {
                _id: null, 
                averageTickets: { $avg: "$ticketCount" } 
            }
        }
    ];

    return pipeline ;
}

module.exports =  { ticketsCountByStatus , ticketsByUser , averageNumberOfTicketsPerUser }