/*Desde aquí iniciamos nuestra aplicación */
const express = require('express');
const config = require('./server/config');
//empezando el servidor
require('./database');
const app = config(express());

app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});


