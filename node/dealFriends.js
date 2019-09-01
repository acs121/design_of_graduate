var mysql      = require('mysql');
var express = require('express');
var expressWs = require('express-ws');
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


router.ws('/wstwo', function (ws, req){
      listen.on('refreshNews',function(){
          ws.send(2);
      })
      event.on('sendApply', function() { 
            ws.send(2);
        }); 
   })
   //获取好友列表
   .post('/getFriendsList',function(req,res){  
        var  findsql = 'SELECT friends FROM user where id='+req.body.username;
        connection.query(findsql,function (err, result) {
            if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
            }
            return res.json(result);
        })
   })
   //判断是否已经为好友
   .post('/isAdd',function(req,res){
        var findsql="SELECT friends FROM user where id="+req.body.id;
        connection.query(findsql,function (err, result) {
            if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
           if(result[0].friends==null){
               return res.json({state:0});
           }else{
                if(result[0].friends.indexOf(req.body.user)!=-1){
                    return res.json({state:1});
                }else{
                    return res.json({state:0});
                }
           }
            
        })
   })
   //添加好友
   .post('/addFriend',function(req,res){
        var findsql="SELECT * FROM user where id="+req.body.user;
        connection.query(findsql,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            
            if(result[0].systemNews==null||result[0].systemNews==''){
                var findName="SELECT * FROM user where id="+req.body.id;
                connection.query(findName,function (err, findresult) {
                    if(err){
                        console.log('[SELECT ERROR] - ',err.message);
                        return;
                    }
                    var inserParam=[{"msgType":1,"userOne":parseInt(req.body.id),
                    "userTwo":parseInt(req.body.user),"userOneName":findresult[0].name,"userTwoName":result[0].name}];
                    var insertSql="UPDATE  user set systemNews=? where id="+req.body.user ;
                    connection.query(insertSql,JSON.stringify(inserParam),function (err, newresult) {
                        if(err){
                            console.log('[INSERT ERROR] - ',err.message);
                            return;
                        }
                        event.emit('sendApply');
                        return res.json({state:1});           
                    });
                })
                
            }else{
                var findName="SELECT * FROM user where id="+req.body.id;
                connection.query(findName,function (err, findresult) {
                    if(err){
                        console.log('[SELECT ERROR] - ',err.message);
                        return;
                    }
                    var inserParam={"msgType":1,"userOne":parseInt(req.body.id),"userTwo":(req.body.user),
                    "userOneName":findresult[0].name,"userTwoName":result[0].name};
                    var sysNews=JSON.parse(result[0].systemNews);
                    sysNews.push(inserParam);
                    var insertSql="UPDATE  user set systemNews=? where id="+req.body.user ;
                    connection.query(insertSql,JSON.stringify(sysNews),function (err, newresult) {
                        if(err){
                            console.log('[INSERT ERROR] - ',err.message);
                            return;
                        } 
                        event.emit('sendApply');   
                        return res.json({state:1});       
                    });
                })
            }
        })
   })
   //拒绝添加好友
   .post('/refuseAdd',function(req,res){
       //先删除自己的系统消息
       var findUserTwoSql="SELECT * FROM user where id="+req.body.userTwo;
        connection.query(findUserTwoSql,function (err, findresult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            var sysNews=JSON.parse(findresult[0].systemNews);
            for(var i=0;i<sysNews.length;i++){
                if(sysNews[i].userOne==req.body.userOne){
                    sysNews.splice(i-1,1);
                }
            }
            var insertSql="UPDATE  user set systemNews=? where id="+req.body.userTwo ;
            connection.query(insertSql,JSON.stringify(sysNews),function (err, newresult) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                }      
            });
        })
        var findSql="SELECT * FROM user where id="+req.body.userOne;
        connection.query(findSql,function (err, findresult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if(findresult[0].systemNews==null||findresult[0].systemNews==''){
                var refuseObject=[{"msgType":2,"userOne":req.body.userOne,
                "userTwo":req.body.userTwo,"userTwoName":req.body.userTwoName}];
                var insertSql="UPDATE  user set systemNews=? where id="+req.body.userOne ;
                connection.query(insertSql,JSON.stringify(refuseObject),function (err, newresult) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    } 
                    event.emit('sendApply');   
                    return res.json({state:1});       
                });
            }else{
                var sysNews=JSON.parse(findresult[0].systemNews);
                var refuseObject={"msgType":2,"userOne":req.body.userOne,
                "userTwo":req.body.userTwo,"userTwoName":req.body.userTwoName};
                sysNews.push(refuseObject);
                var insertSql="UPDATE  user set systemNews=? where id="+req.body.userOne ;
                connection.query(insertSql,JSON.stringify(sysNews),function (err, newresult) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    } 
                    event.emit('sendApply');   
                    return res.json({state:1});       
                });
            }
       })
       
   })
   //接收添加好友
   .post('/receptAdd',function(req,res){
    //    先删除自己的系统消息
       var findUserTwoSql="SELECT * FROM user where id="+req.body.userTwo;
        connection.query(findUserTwoSql,function (err, findresult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            var sysNews=JSON.parse(findresult[0].systemNews);
            for(var i=0;i<sysNews.length;i++){
                if(sysNews[i].userOne==req.body.userOne){
                    sysNews.splice(i-1,1);
                }
            }
            var insertSql="UPDATE  user set systemNews=? where id="+req.body.userTwo ;
            connection.query(insertSql,JSON.stringify(sysNews),function (err, newresult) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                }      
            });
        })
        //将双方互相添加到对应的好友列表中
        var findUserOneSql="SELECT * FROM user where id="+req.body.userOne;
        connection.query(findUserOneSql,function (err, findresult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if(findresult[0].friends==null||findresult[0].friends==''){
                var insertObject=[{"name":req.body.userTwoName,"id":req.body.userTwo}];
                var insertSql="UPDATE  user set friends=? where id="+req.body.userOne;
                connection.query(insertSql,JSON.stringify(insertObject),function (err, newresult) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }      
                });
            }else{
                var friends=JSON.parse(findresult[0].friends);
                var insertObject={"name":req.body.userTwoName,"id":req.body.userTwo};
                var insertSql="UPDATE  user set friends=? where id="+req.body.userOne;
                friends.push(insertObject);
                connection.query(insertSql,JSON.stringify(friends),function (err, newresult) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }      
                });
            }
        })
        connection.query(findUserTwoSql,function (err, findresult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            
            if(findresult[0].friends==null||findresult[0].friends==''){
                var insertObject=[{"name":req.body.userOneName,"id":req.body.userOne}];
                console.log(insertObject)
                var insertSql="UPDATE  user set friends=? where id="+req.body.userTwo;
                connection.query(insertSql,JSON.stringify(insertObject),function (err, newresult) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }      
                });
            }else{
                var friends=JSON.parse(findresult[0].friends);
                var insertObject={"name":req.body.userOneName,"id":req.body.userOne};
                var insertSql="UPDATE  user set friends=? where id="+req.body.userTwo;
                friends.push(insertObject);
                connection.query(insertSql,JSON.stringify(friends),function (err, newresult) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }      
                });
            }
        })
        //发送接收添加请求消息
        var findSql="SELECT * FROM user where id="+req.body.userOne;
        connection.query(findSql,function (err, findresult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if(findresult[0].systemNews==null||findresult[0].systemNews==''){
                var refuseObject=[{"msgType":3,"userOne":req.body.userOne,
                "userTwo":req.body.userTwo,"userTwoName":req.body.userTwoName}];
                var insertSql="UPDATE  user set systemNews=? where id="+req.body.userOne ;
                connection.query(insertSql,JSON.stringify(refuseObject),function (err, newresult) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    } 
                    event.emit('sendApply');   
                    return res.json({state:1});       
                });
            }else{
                var sysNews=JSON.parse(findresult[0].systemNews);
                var refuseObject={"msgType":3,"userOne":req.body.userOne,
                "userTwo":req.body.userTwo,"userTwoName":req.body.userTwoName};
                sysNews.push(refuseObject);
                var insertSql="UPDATE  user set systemNews=? where id="+req.body.userOne ;
                connection.query(insertSql,JSON.stringify(sysNews),function (err, newresult) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    } 
                    event.emit('sendApply');   
                    return res.json({state:1});       
                });
            }
       })
   })
   //删除消息
   .post('/deleteMsg',function(req,res){
        var findSql="SELECT * FROM user where id="+req.body.userOne;
        connection.query(findSql,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            var sysNews=JSON.parse(result[0].systemNews);
            for(var i=0;i<sysNews.length;i++)
            {
                if(sysNews[i].userTwo==req.body.userTwo)
                {
                    sysNews.splice(i-1,1);
                }
            }
            var updateSql="UPDATE  user set systemNews=? where id="+req.body.userOne ;
            connection.query(updateSql,JSON.stringify(sysNews),function (err, newresult) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                } 
                event.emit('sendApply');   
                return res.json({state:1});       
            });       
        });

   })
module.exports=router;