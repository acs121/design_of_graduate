var mysql      = require('mysql');
var app=require('./server.js');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'acs121676',
  database : 'appdata'
});

const chatRoom={
    //初始加载聊天信息
    getChatRoomMsgList:function(chatRoomId,userOne,userTwo,res){
        var  findsql = 'SELECT * FROM chatroom where chatId='+chatRoomId;
        connection.query(findsql,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if(result.length==0)
            {
                var UserOneName,UserTwoName;
                var getUserOneNameSql='SELECT name FROM user where id='+userOne;
                connection.query(getUserOneNameSql,function (err, result) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }
                    UserOneName=result[0].name;         
                });
                var getUserTwoNameSql='SELECT name FROM user where id='+userTwo;
                connection.query(getUserTwoNameSql,function (err, result) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    } 
                    UserTwoName=result[0].name;
                    var news=[{"name":userOne,"num":0},{"name":userTwo,"num":0}];
                    news=JSON.stringify(news);
                    var insertsql='INSERT INTO chatroom(chatId,user_one,user_two,user_one_name,user_two_name,unread) VALUES(?,?,?,?,?,?)';
                    var insertparams=[chatRoomId,userOne,userTwo,UserOneName,UserTwoName,news];
                    connection.query(insertsql,insertparams,function (err, newresult) {
                        if(err){
                            console.log('[INSERT ERROR] - ',err.message);
                            return;
                        }           
                    });             
                });
                return res.json({content:0});
            }
                
            else{
                //把自己的未读信息归零
                var findUnreadSql='SELECT * FROM chatroom where chatId='+chatRoomId;
                connection.query(findUnreadSql,function (err, unreadResult) {
                    if(err){
                        console.log('[SELECT ERROR] - ',err.message);
                        return;
                    }
                    var unread=JSON.parse(unreadResult[0].unread);
                    if(unread[0].name==userOne){
                        var newUnread=[{"num":0,"name":unread[0].name},{"num":unread[1].num,"name":unread[1].name}];
                        var updateSql='UPDATE chatroom SET unread=? WHERE chatId = '+chatRoomId;
                        connection.query(updateSql,JSON.stringify(newUnread),function (err, result) {
                            if(err){
                                    console.log('[UPDATE ERROR] - ',err.message);
                                    return;
                            }       
                        });
                    }else{
                        var newUnread=[{"num":unread[0].num,"name":unread[0].name},{"num":0,"name":unread[1].name}];
                        var updateSql='UPDATE chatroom SET unread=? WHERE chatId = '+chatRoomId;
                        connection.query(updateSql,JSON.stringify(newUnread),function (err, result) {
                            if(err){
                                    console.log('[UPDATE ERROR] - ',err.message);
                                    return;
                            }       
                        });
                    }
                    
                })
                //查询出聊天内容返回
                var selectsql='SELECT chatContent FROM chatroom where chatId='+chatRoomId;
                connection.query(findsql,function (err, result) {
                    if(err){
                        console.log('[SELECT ERROR] - ',err.message);
                        return;
                    }
                    return res.json({content:result});
                })
            }
        })
    },
    //查询聊天ID
    checkChatId:function(chatRoomId,res){
        var selectsql='SELECT * FROM chatroom where chatId='+chatRoomId;
        connection.query(selectsql,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if(result.length!=0)
                return res.json({state:1});
            else if(result.length==0)
                return res.json({state:0});
        })
    }
    
}


module.exports=chatRoom;