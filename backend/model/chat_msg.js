var db = require('./db');

var messageCount=0

var Message = function (msg) {
    var that = new Object();

    that.userID = msg.userID
    that.message = msg.message
    that.inserted_date = msg.inserted_date

    return that;
};

var insertMessage = function (messagePacket, callback) {
    
    var newMessage = {
        userID: messagePacket.fromUserId,
        message: messagePacket.message,
        inserted_date: messagePacket.inserted_date
    };
    
    db.query(`INSERT INTO message_history (userID, message, inserted_date ) values (?,?,?)`,
        [messagePacket.fromUserId, messagePacket.message, messagePacket.inserted_date],
        function (err) {
            if (err) {
                return callback(err);
            }
            
            return callback(null, new Message(newMessage));
        }
    )
}

var getMessage = function (callback){
    db.query(`SELECT * FROM message_history ORDER BY ID DESC LIMIT 10 `,
        function (err,rows) {
            if (err) {             
                return callback(err);
            }else{                          
                return callback(null, rows);
            }            
        }
    )
}

exports.insertMessage = insertMessage
exports.getMessage = getMessage