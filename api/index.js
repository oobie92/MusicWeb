'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3977;
    
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/mean2', { useNewUrlParser: true }, (err, res) => {
  if(err){
      throw err;
  }else{
      console.log("Conexion accepted by Mongodb to mean2! -> mongodb://localhost:27017/mean2 ");

      app.listen(port, () => {
          console.log("API Rest is up on http://localhost:"+port);
      });
  }
});
