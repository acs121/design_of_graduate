var express = require('express');
var expressWs = require('express-ws');
var mysql      = require('mysql');
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter();
var listen=require('./listen.js');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'acs121676',
  database : 'appdata'
});
var router = express.Router();
expressWs(router);

router
  .ws('/wsone', function (ws, req){
      ws.on('message', function (msg) {
          ws.send(1);
      })
      event.on('touchUpdateMsg', function() { 
            ws.send(1); 
        }); 
   })
  .post('/sendMsg', function(req, res) {
      //改变未读消息数
      var selectsql='SELECT * FROM chatroom where chatId='+req.body.chatRoomId;
        connection.query(selectsql,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            var unread=JSON.parse(result[0].unread);
            if(unread[0].name==req.body.userId){
                unread[1].num++;
                var newUnread=[{"num":0,"name":unread[0].name},{"num":unread[1].num,"name":unread[1].name}]
                var updateSql='UPDATE chatroom SET unread=? WHERE chatId = '+req.body.chatRoomId;
                connection.query(updateSql,JSON.stringify(newUnread),function (err, result) {
                    if(err){
                            console.log('[UPDATE ERROR] - ',err.message);
                            return;
                    }       
                });
            }else{
                unread[0].num++;
                var newUnread=[{"num":unread[0].num,"name":unread[0].name},{"num":0,"name":unread[1].name}]
                var updateSql='UPDATE chatroom SET unread=? WHERE chatId = '+req.body.chatRoomId;
                connection.query(updateSql,JSON.stringify(newUnread),function (err, result) {
                    if(err){
                            console.log('[UPDATE ERROR] - ',err.message);
                            return;
                    }       
                });
            }
            //返回聊天消息
            var chatContent;
            if(result[0].chatContent==null||result[0].chatContent==''){
                chatContent=[];
            }else{
                chatContent=JSON.parse(result[0].chatContent);
            }
            chatContent.push({"user":req.body.userId,"content":req.body.content});
            var modSql = 'UPDATE chatroom SET chatContent=? WHERE chatId = '+req.body.chatRoomId;
            connection.query(modSql,JSON.stringify(chatContent),function (err, updateresult) {
                if(err){
                        console.log('[UPDATE ERROR] - ',err.message);
                        return;
                }
                //改变聊天室在聊天中的次序
                connection.query(selectsql,function (err, findResult) {
                    if(err){
                        console.log('[SELECT ERROR] - ',err.message);
                        return;
                    }
                    //改变user_one
                    var userOneSql='SELECT chatOrder FROM user WHERE id='+findResult[0].user_one;
                    connection.query(userOneSql,function (err, findUserOneResult) {
                        if(err){
                            console.log('[SELECT ERROR] - ',err.message);
                            return;
                        }
                        if(findUserOneResult[0].chatOrder==null){
                            var chatOrder=[req.body.chatRoomId];
                            var updateUserOne='UPDATE user SET chatOrder=? WHERE id='+findResult[0].user_one;
                            connection.query(updateUserOne,JSON.stringify(chatOrder),function (err, updateresult) {
                                if(err){
                                    console.log('[UPDATE ERROR] - ',err.message);
                                    return;
                                }
                            })
                        }else{
                            var chatOrder=JSON.parse(findUserOneResult[0].chatOrder);
                            if(chatOrder[chatOrder.length-1]!=req.body.chatRoomId){
                                for(var i=0;i<chatOrder.length;i++){
                                    if(chatOrder.indexOf(req.body.chatRoomId)!=-1){
                                        chatOrder.splice(i,1);
                                    }
                                }
                                chatOrder.push(req.body.chatRoomId)
                                var updateUserOne='UPDATE user SET chatOrder=? WHERE id='+findResult[0].user_one;
                                connection.query(updateUserOne,JSON.stringify(chatOrder),function (err, updateresult) {
                                    if(err){
                                        console.log('[UPDATE ERROR] - ',err.message);
                                        return;
                                    }
                                })
                            }
                        }
                    })
                    //改变user_two
                    var userTwoSql='SELECT chatOrder FROM user WHERE id='+findResult[0].user_two;
                    connection.query(userTwoSql,function (err, findUserOneResult) {
                        if(err){
                            console.log('[SELECT ERROR] - ',err.message);
                            return;
                        }
                        if(findUserOneResult[0].chatOrder==null){
                            var chatOrder=[req.body.chatRoomId];
                            var updateUserOne='UPDATE user SET chatOrder=? WHERE id='+findResult[0].user_two;
                            connection.query(updateUserOne,JSON.stringify(chatOrder),function (err, updateresult) {
                                if(err){
                                    console.log('[UPDATE ERROR] - ',err.message);
                                    return;
                                }
                            })
                        }else{
                            
                            var chatOrder=JSON.parse(findUserOneResult[0].chatOrder);
                            if(chatOrder[chatOrder.length-1]!=req.body.chatRoomId){
                                for(var i=0;i<chatOrder.length;i++){
                                    if(chatOrder.indexOf(req.body.chatRoomId)!=-1){
                                        chatOrder.splice(i,1);
                                    }
                                }
                                chatOrder.push(req.body.chatRoomId)
                                var updateUserOne='UPDATE user SET chatOrder=? WHERE id='+findResult[0].user_two;
                                connection.query(updateUserOne,JSON.stringify(chatOrder),function (err, updateresult) {
                                    if(err){
                                        console.log('[UPDATE ERROR] - ',err.message);
                                        return;
                                    }
                                })
                            }
                        }
                    })
                })
                event.emit('touchUpdateMsg'); 
                listen.emit('refreshNews');
                return res.json({state:1});        
            });
            
        })
  })
  

module.exports = router;