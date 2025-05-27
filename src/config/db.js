const{Pool} = require('pg');
require('dotenv').config();
console.log(process.env.db_url)

const pool = new Pool ({
    connectionString: process.env.db_url,
});
  

pool.connect()
.then(() => {
    console.log("Conectado A DB"); 
    //return pool.end();
})

.catch(err => {console.log("Error al conectarse a DB")});

//se exporta para que otro archivo lo pueda leer
module.exports = pool;   