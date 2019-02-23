'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // This is Mongodb's model. Allows to create a collection using this schema!

const ArtistSchema = Schema({
        name: String,
        description: String,
        image: String
    });

module.exports = mongoose.model('Artist', ArtistSchema); // (Object User(saves plural auto), using a model)
