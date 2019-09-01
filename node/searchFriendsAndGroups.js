var mysql      = require('mysql');
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter();
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'acs121676',
  database : 'appdata'
});

function searchFriendsAndGroups(text,res){
    if(!isNaN(Number(text)))
    {
        var  findUserIdSql = 'SELECT name FROM user where id='+text;
        connection.query(findUserIdSql,function (err, userResult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if(userResult.length!=0){
                return res.json({name:userResult[0].name,id:text,state:1});
            }else{
                var  findGroupIdSql = 'SELECT groupName FROM groups where groupId='+text;
                connection.query(findGroupIdSql,function (err, groupResult) {
                    if(err){
                        console.log('[SELECT ERROR] - ',err.message);
                        return;
                    }
                    if(groupResult.length!=0){
                        return res.json({name:groupResult[0].groupName,id:text,state:1});
                    }else{
                        return res.json({state:0});
                    }   
                })
            }
        })
    }
    else{
        var  findUsernameSql = "SELECT id,name FROM user where name LIKE '%"+text+"%'";
        var dataArr=[];
        connection.query(findUsernameSql,function (err, userResult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if(userResult.length!=0){
                for(var i=0;i<userResult.length;i++)
                {
                    dataArr.push(userResult[i]);
                }
                
            }
        })
        var textString='';
        for(var i=0;i<text.length;i++)
        {
            textString+='%'+text[i]
        }
        textString=textString+'%';
        var findGroupSql="SELECT groupId,groupName FROM groups where groupName LIKE '"+textString+"'";
        connection.query(findGroupSql,function (err, groupResult) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if(groupResult.length!=0){
                for(var i=0;i<groupResult.length;i++){
                    dataArr.push({"name":groupResult[i].groupName,"id":groupResult[i].groupId})
                }
            }
            if(dataArr.length!=0){
                return res.json({data:dataArr,state:2});
            }else if(dataArr.length==0){
                return res.json({state:0});
            }
        })
    }
    
}

module.exports=searchFriendsAndGroups;