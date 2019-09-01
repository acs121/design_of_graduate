var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'acs121676',
  database : 'appdata'
});

function login(username,password,res){
    var  findsql ='select * from user where id='+username+' and password='+password;
    connection.query(findsql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
       if(result.length!=0)
       {
           return res.json({state:1});
       }else if(result.length==0){
           return res.json({state:0});
       }
    });
}

module.exports=login;