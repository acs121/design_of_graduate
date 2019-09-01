var mysql      = require('mysql');
var getNameId=require('./getNameId.js');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'acs121676',
  database : 'appdata'
});

const dealGroup={
    getGroupsList:function(username,res){
        var  findsql = 'SELECT groups FROM user where id='+username;
        connection.query(findsql,function (err, result) {
            if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
            return res.json(result);
        })
    },
    createGroup:function(GroupName,GroupLastName,GroupIntroduce,lord,res){
        //插入群相关信息
        var getLengthSql='SELECT * from groups';
        connection.query(getLengthSql,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            var groupId=10001+result.length;
            var insertData=[groupId,lord,'['+lord+']',GroupName,getNameId(GroupLastName),GroupIntroduce];
            var insertSQl='INSERT INTO groups(groupId,lord,users,groupName,nameId,introduce) VALUES(?,?,?,?,?,?)';
            connection.query(insertSQl,insertData,function (err, newResult) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                }
                //将该群插入用户的群列表中
                var searchGroups='SELECT groups from user where id='+lord;
                connection.query(searchGroups,function (err, searchResult) {
                    if(err){
                        console.log('[ERROR] - ',err.message);
                        return;
                    }
                    var groups=JSON.parse(searchResult[0].groups);
                    var addData={"groupId":groupId,"groupName":GroupName};
                    groups.push(addData);
                    var updateGroups="UPDATE  user set groups=? where id="+lord;
                    connection.query(updateGroups,JSON.stringify(groups),function (err, searchResult) {
                        if(err){
                            console.log('[ERROR] - ',err.message);
                            return;
                        }
                    })
                })
                return res.json({state:1})
            }) 
        }) 
    }
}

module.exports=dealGroup;