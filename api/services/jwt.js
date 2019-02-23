'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'mean2';

exports.createToken = (user) => {
  const payload = {
        sub: user._id, //Id from DB
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
      };

      return jwt.encode(payload, secret);
};
