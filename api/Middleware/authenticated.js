'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_curso';

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send({message: "There's no authenticated header"});
    }

    const token = req.headers.authorization.replace(/['"]+/g, ''); //Replace  ' & "

    try{
        const payload = jwt.decode(token, secret);

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
