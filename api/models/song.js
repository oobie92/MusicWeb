'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // This is Mongodb's model. Allows to create a collection using this schema!

const SongSchema = Schema({
        number: String,
        name: String,
        duration: String,
        file: String,
        album: { type: Schema.ObjectId, ref: 'Album'} // Save an Id from db and i'tll be an "Album" type
    });

module.exports = mongoose.model('Song', SongSchema); // (Object User(saves plural auto), using a model)
