'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema, // This is Mongodb's model. Allows to create a collection using this schema!

    ArtistSchema = Schema({
        name: String,
        description: String,
        image: String
    });

module.exports = mongoose.model('Artist', ArtistSchema); // (Object User(saves plural auto), using a model)
