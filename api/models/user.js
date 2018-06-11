'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema, // This is Mongodb's model. Allows to create a collection using this schema!

    UserSchema = Schema({
        name: String,
        surname: String,
        email: String,
        password: String,
        role: String,
        image: String
    });

module.exports = mongoose.model('User', UserSchema); // (Object User(saves plural auto), using a model)
