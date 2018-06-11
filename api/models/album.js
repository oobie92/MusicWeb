'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema, // This is Mongodb's model. Allows to create a collection using this schema!

    AlbumSchema = Schema({
        title: String,
        description: String,
        year: Number,
        image: String,
        artist: { type: Schema.ObjectId, ref: 'Artist'} // Save an Id from db and i'tll be an "Artist" type
    });

module.exports = mongoose.model('Album', AlbumSchema); // (Object User(saves plural auto), using a model)
