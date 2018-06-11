'use strict'

var mongoose = require('mongoose'),
    app = require('./app'),
    port = process.env.PORT || 3977;
    mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/mean2', (err, res) => {
  if(err){
      throw err;
  }else{
      console.log("Conexion accepted by Mongodb to mean2! -> mongodb://localhost:27017/mean2 ");

      app.listen(port, function(){
          console.log("API Rest is up on http://localhost:"+port);
      });
  }
});
