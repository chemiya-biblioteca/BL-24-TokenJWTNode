const express =require('express');
const apiRouter = express.Router();
 
 const jsonwebtoken = require('jsonwebtoken');
const db = require('./db');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const cookieParser = require('cookie-parser');
 
const userRouter = require('./user');
 
 
apiRouter.use(cookieParser());//para las cookies
 
apiRouter.post('/register', async (req, res, next)=>{
    try{//ruta de registro
        const userName = req.body.userName;
        const email = req.body.email;
        let password = req.body.password;//cogemos los campos
  
  
              if (!userName || !email || !password) {//comprobacion
                return res.sendStatus(400);
             }
  
             const salt = genSaltSync(10);
             password = hashSync(password, salt);//genera el hash
  
               
  
        const user =  await db.insertUser(userName, email, password);//insetamos usuario
         
        const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );///generamos token
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
 //generamos la cookie
 
        res.json({token: jsontoken});//devolvemos json
 
            //return res.redirect('/mainpage');
  
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});
 
 
 
 
 apiRouter.post('/login', async(req, res, next)=>{
    try{
    const email = req.body.email;//cogemos los campos
    const password = req.body.password;
    user = await db.getUserByEmail(email);//buscamos por email
     
    if(!user){
        return res.json({
            message: "Invalid email or password"
        })
    }//comprobamos qu esea correcto
 
    const isValidPassword = compareSync(password, user.password);//comprobamos la contraseñla
    if(isValidPassword){//si es valida
        user.password = undefined;//generamos token y lo devolvemos
        const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
 
        res.json({token: jsontoken});//creamos la cooki y devolvemos json
       //return res.redirect('/mainpage') ;
 
    }  else{
        return res.json({
            message: "Invalid email or password"
        });
    } 
 
    } catch(e){
        console.log(e);
    }
});
 
 
 
 
 
 
 
 
    
  
//  Verify Token
async function  verifyToken  (req, res, next){
    
   const token=req.cookies.token;//cogemos el token
    console.log(token);
     
    if(token === undefined  ){//comprobacion no vacio
         
            return res.json({
                message: "Access Denied! Unauthorized User"
              });
    } else{
 
        jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, authData)=>{
            if(err){//verificamos el token
                res.json({
                    message: "Invalid Token..."
                  });
 
            } else{
                
               console.log(authData.user.role);
               const role = authData.user.role;//buscamos el role
              /* if(role === "admin"){
 
                next();
               } else{
                   return res.json({
                       message: "Access Denied! you are not an Admin"
                     });
 
               }*/
            }
        })
    } 
}
 
 
 
 
 
   apiRouter.use('/user', verifyToken, userRouter);
 
 
    
module.exports = apiRouter;