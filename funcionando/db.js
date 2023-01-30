const mysql = require('mysql');
   
    
    
const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,    // the number of connections node.js will hold open to our database
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    
    
});
    
 
    //creamos la tabla
   
    pool.query('CREATE TABLE if not exists User (' +
          'id int(11) NOT NULL AUTO_INCREMENT,' +
          'user_name varchar(255) NOT NULL,' +
          'role varchar(255) default "employee",' +
          'email varchar(255) NOT NULL,' +
          'password varchar(255) NOT NULL,' +
          'PRIMARY KEY (id),'+
          'UNIQUE KEY email_UNIQUE (email),' +
          'UNIQUE KEY password_UNIQUE (password))', function (err, result) {
              if (err) throw err;
              console.log("User created");
            }
         );
    
   
    
let db = {}; //para las consultas

db.allUser = () =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM User ', (error, users)=>{
            if(error){//consulta para uscar los usurios, devolvemos lo que encuentre
                return reject(error);
            }
            return resolve(users);
        });
    });
};
 
 
db.getUserByEmail = (email) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM User WHERE email = ?', [email], (error, users)=>{
            if(error){//buscamos por email y devolvemos el usuario
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};
 
 
 
db.insertUser = (userName, email, password) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO User (user_name, email, password) VALUES (?,  ?, ?)', [userName, email, password], (error, result)=>{
            if(error){//Insertamos el usuario y devolvemos el id
                return reject(error);
            }
             
              return resolve(result.insertId);
        });
    });
};
 
 
db.updateUser = (userName, role, email, password, id) =>{
    return new Promise((resolve, reject)=>{//actualizamos el usuario 
        pool.query('UPDATE User SET user_name = ?, role= ?, email= ?, password=? WHERE id = ?', [userName, role, email, password, id], (error)=>{
            if(error){
                return reject(error);
            }
             
              return resolve();
        });
    });
};
 
 
 
db.deleteUser = (id) =>{
    return new Promise((resolve, reject)=>{//borramoel usuario
        pool.query('DELETE FROM User WHERE id = ?', [id], (error)=>{
            if(error){
                return reject(error);
            }
            return resolve(console.log("User deleted"));
        });
    });
};
    
module.exports = db