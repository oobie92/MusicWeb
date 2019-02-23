'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // This is Mongodb's model. Allows to create a collection using this schema!

const UserSchema = Schema({
        name: String,
        surname: String,
        email: String,
        password: String,
        role: String,
        image: String
    });

module.exports = mongoose.model('User', UserSchema); // (Object User(saves plural auto), using a model)
