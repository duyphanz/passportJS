const mongoose = require('mongoose');
const {config} = require('./config')
const URL = config.urlDB;
mongoose.connect(URL);


//event handler
mongoose.connection.once('connected', () => {
    console.log('Connected DB to: ', URL);
})

mongoose.connection.on('error', (err) => {
    console.log('DB error connection:', err);
    
})

mongoose.connection.on('Disconnected', () => {
    console.log('Dissconnected to DB');
    
})

