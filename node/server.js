var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var bodyParser = require("body-parser");  
var regist=require( './regist.js');
var login=require( './login.js');
var getProfiles=require( './getProfiles.js');
var dealFriends=require( './dealFriends.js');
var chatRoom=require( './chatRoom.js');
var send=require("./send.js");
var dealMsg=require("./dealMsg.js");
var dealGroup=require("./dealGroup.js");
var searchFriendsAndGroups=require("./searchFriendsAndGroups.js");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'acs121676',
  database : 'appdata'
});
connection.connect();

app.ws('/wsone', function(ws, req) {
  ws.on('message', function(msg) { 
    ws.send(1);
  })
})
module.exports=app;

app.use(bodyParser.urlencoded({ extended: false }));  
//注册接口
app.post('/regist', function (req, res) {
   regist(req.body.username,req.body.password,req.body.name,req.body.city,res);
})
//登录接口
app.post('/login', function (req, res) {
   login(req.body.username,req.body.password,res);
})
//获取个人信息接口
app.post('/getProfiles', function (req, res) {
   getProfiles(req.body.username,res);
})

//处理朋友逻辑
app.use('/ifc', dealFriends);

//获取聊天记录
app.post('/getChatMsgList', function (req, res) {
  chatRoom.getChatRoomMsgList(req.body.chatRoomId,req.body.userOne,req.body.userTwo,res);
})

//发送信息
app.use('/ifc', send);
//获取消息列表
app.use('/ifc', dealMsg);
//查询聊天ID
app.post('/checkChatId', function (req, res) {
  chatRoom.checkChatId(req.body.chatRoomId,res);
})

//获取群列表
app.post('/getGroupsList', function (req, res) {
    dealGroup.getGroupsList(req.body.userId,res);
})

//搜索好友或群
app.post('/searchFriendsAndGroups', function (req, res) {
    searchFriendsAndGroups(req.body.searchText,res);
})
//创建群聊
app.post('/createGroup', function (req, res) {
    dealGroup.createGroup(req.body.GroupName,req.body.GroupLastName,req.body.GroupIntroduce,req.body.lord,res);
})

app.get('/', function (req, res) {
   console.log(111);
   res.end('hello');
})
 
var server = app.listen(8080, function () {
 
  var host = server.address().address;
  var port = server.address().port;
 
})

