require("dotenv").config();
const express =require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
 
const apiRouter = require('./apiRouter');
    
const app = express();//llamamos expres
    
    
    
const PORT= process.env.PORT;//utilizamos el puerto
    
app.use(bodyParser.json());//conversion a json y cors
app.use(cors());
 
apiRouter.use(cookieParser());//conversor cookies
 
app.use('/apiRouter',apiRouter)//lllamamos las rutas
    
app.listen(PORT, ()=>{//escuchar en el puerto
    console.log(`server is listening  on ${PORT}`);
});
    
module.exports = app;