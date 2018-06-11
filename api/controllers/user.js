'use strict'

var User = require('../models/user'),
    fs = require('fs'),
    path = require('path'),
    bcrypt = require('bcrypt-nodejs'),
    jwt = require('../services/jwt');

function test(req, res){
    res.status(200).send({
      mesaage: ' => User-Controller working properly <= '
    });
}

function saveUser(req, res){
    var user = new User(),

        params = req.body;

        console.log(params);
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_ADMIN';
        user.image = 'null';

        if(params.password){
            //Encript pass
            bcrypt.hash(params.password, null, null, function(err, hash){
                user.password = hash;
                if(user.name != null && user.surname != null
                && user.email != null){
                    //Save Users
                    user.save((err, userStored) => {
                        if(err){
                            res.status(500).send({message: "Error! Couldn't save user"});
                        }else {
                            if(!userStored){
                              res.status(404).send({message: 'User not found'});
                            }else{
                              res.status(200).send({user: userStored});
                            }
                        }
                    });

                }else{
                    res.status(200).send({message: 'Complete all the fields'});
                }
            });

        } else {
            res.status(200).send({message: 'Input your password'});
        }
}

function loginUser(req, res){
    var params = req.body,

        email = params.email,
        password = params.password;

        User.findOne({email: email.toLowerCase()}, (err, user) => {
            if(err){
                res.status(500).send({message: 'Error! Something went wrong'});
            }else{
                if(!user){
                    res.status(404).send({message: 'User not found'});
                }else{
                    //Compare pass
                    bcrypt.compare(password, user.password, function(err, check){
                        if(check){
                            //Return users info logged in
                            if(params.gethash){
                                //Return jwt token
                                res.status(200).send({
                                  token: jwt.createToken(user)
                                });
                            }else{
                              res.status(200).send({user});
                            }
                        }else{
                            res.status(404).send({message: "Couldn't logged in"});
                        }
                    });

                }
            }
        });

}

function updateUser(req, res){
    var userId = req.params.id,
        update = req.body;

        if(userId != req.user.sub){
        return res.status(500).send({message: 'Insufficient privileges'});
        }

        User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
            if(err){
              res.status(500).send({message: 'Error while trying to update user'});
            }else{
              if(!userUpdated){
                res.status(404).send({message: 'User not found'});
              }else{
                res.status(200).send({user: userUpdated});

              }
            }

        });

}


function uploadImage(req, res){
  var userId = req.params.id,
      file_name = 'Not uploaded...';

  if(req.files){
    var file_path = req.files.image.path,
        file_split = file_path.split('\\'),
        file_name = file_split[2],
        ext_split = file_name.split('\.'),
        file_ext = ext_split[1] ;

        console.log(file_name);
        console.log(file_ext);
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
              if(!userUpdated){
                res.status(404).send({message: 'Not Found! Could not update user'});
              }else{
                res.status(200).send({image: file_name, user: userUpdated});
              }
            });

        }else{
            res.status(200).send({message: 'Extension not valid'});
        }

    }else{
    res.status(200).send({message: 'Image had not been selected'});

    console.log(file_path);
  }


}

function getImageFile(req, res){
    var imageFile = req.params.imageFile,
        path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Imagen not found'});
        }
    });

}

module.exports = {
    test,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
}
