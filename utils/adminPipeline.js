
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
            $match : {
                role : 'USER'
            }
        },
        {
            $group : {
                _id : "$createdBy",
                average: { $avg : "$_id" }
            }
        }
    ]
    return pipeline ;
}

module.exports =  { ticketsCountByStatus , ticketsByUser , averageNumberOfTicketsPerUser }