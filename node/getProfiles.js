var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'acs121676',
  database : 'appdata'
});

function getProfiles(username,res){
    var  findsql = 'SELECT * FROM user where id='+username;
    connection.query(findsql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
        return res.json(result);
    })
}

module.exports=getProfiles;