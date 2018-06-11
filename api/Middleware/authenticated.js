'use strict'

var jwt = require('jwt-simple'),
    moment = require('moment'),
    secret = 'clave_secreta_curso';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: "There's no authenticated header"});
    }

    var token = req.headers.authorization.replace(/['"]+/g, ''); //Replace  ' & "

    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'Token has expired'});
        }
    }catch(ex){
      //  console.log(ex);
        return res.status(404).send({message: 'Invalid Token'});
    }

    req.user = payload;

    next();
};
