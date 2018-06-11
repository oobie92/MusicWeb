'use strict'

var express = require('express'),
    bodyParser = require('body-parser'),

    app = express();

// Load Routes

var user_routes = require('./routes/user'),
    artist_routes = require('./routes/artist'),
    album_routes = require('./routes/album'),
    song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // Converts HTTPs petitions to JSON

// Headers configurations http

app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

   next();

});

// Base Routes

app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);


module.exports = app;
