
var mysql      = require('mysql');
var getNameId=require('./getNameId.js');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'acs121676',
  database : 'appdata'
});
function regist(username,password,name,city,res){
    var  findsql = 'SELECT id FROM user';
    connection.query(findsql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
        for(var i=0;i<result.length;i++)
        {
            if(result[i].id==username)
            {
                return res.json({state:0});
            }
        } 
        var insertsql='INSERT INTO user(id,password,city,name,nameId) VALUES(?,?,?,?,?)';
        var id=getNameId(name[0]);
        var insertparams=[username,password,city,name,id];
        connection.query(insertsql,insertparams,function (err, result) {
            if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
            }      
            return res.json({state:1});      
        });
    }); 
}

module.exports=regist;