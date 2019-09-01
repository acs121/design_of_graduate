var express = require('express');
var expressWs = require('express-ws');
var mysql      = require('mysql');
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter();
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'acs121676',
  database : 'appdata'
});
var router = express.Router();
expressWs(router);

router
  .ws('/wsthree', function (ws, req){
      
   })
   .post('/getMsgList', function(req, res) {
        let dataArr=[];
        var selectsql='SELECT chatOrder FROM user where id='+req.body.username;
        connection.query(selectsql,function (err, userResult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if(userResult[0].chatOrder==null){
                return res.json({state:0});
            }else{
                var order=JSON.parse(userResult[0].chatOrder)
                for(var i=0;i<order.length;i++)
                {
                    //聊天室ID跟群ID分开
                    if(order[i].length==8)
                    {
                        var selectChatSql='SELECT * FROM chatroom where chatId='+order[i];
                        connection.query(selectChatSql,function (err, chatroomResult) {
                            if(err){
                                console.log('[SELECT ERROR] - ',err.message);
                                return;
                            }
                            var friendId,friendName;
                            if(chatroomResult[0].user_one==req.body.username){
                                friendId=chatroomResult[0].user_two;
                                friendName=chatroomResult[0].user_two_name;
                            }else{
                                friendId=chatroomResult[0].user_one;
                                friendName=chatroomResult[0].user_one_name;
                            }
                            var chatContent=JSON.parse(chatroomResult[0].chatContent);
                            var chatUnread=JSON.parse(chatroomResult[0].unread);
                            var num;
                            if(chatUnread[0].name==req.body.username)
                            {
                                num=chatUnread[0].num;
                            }else{
                                num=chatUnread[1].num;
                            }
                            dataArr.push({"msgType":1,"friendsName":friendName,"friendsId":friendId,
                            "lastMsg":chatContent[chatContent.length-1].content,"unread":num});
                            if(dataArr.length==order.length){
                                return res.json(dataArr);
                            }
                        })
                    }else{
                        var selectGroupSql='SELECT * FROM groups where groupId='+order[i];
                        connection.query(selectGroupSql,function (err, groupResult) {
                            if(err){
                                console.log('[SELECT ERROR] - ',err.message);
                                return;
                            }
                            var groupLastMsg=JSON.parse(groupResult[0].groupContent);
                            dataArr.push({"msgType":2,"groupName":groupResult[0].groupName,"groupId":groupResult[0].groupId,
                        "lastMsg":groupLastMsg[groupLastMsg.length-1].content});
                            if(dataArr.length==order.length){
                                return res.json(dataArr);
                            }
                        })
                    }
                }
            }
            
        })
   })
   .post('/getSysMsg',function(req,res){
            var selectsql='SELECT systemNews FROM user where id='+req.body.username;
            connection.query(selectsql,function (err, sysMsgResult) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }
                if(sysMsgResult[0].systemNews==''||sysMsgResult[0].systemNews==null){
                    return res.json({state:0});
                }else{
                    return res.json(sysMsgResult[0].systemNews);
                }
                
            })
        })

module.exports = router;