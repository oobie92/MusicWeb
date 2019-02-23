'use strict'

const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function test(req, res){
    res.status(200).send({
      mesaage: ' => User-Controller working properly <= '
    });
}

function saveUser(req, res){
    const user = new User();

    const params = req.body;

        console.log(params);
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_ADMIN';
        user.image = 'null';

        if(params.password){
            //Encript pass
            bcrypt.hash(params.password, null, null, (err, hash) => {
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
    const params = req.body;

    const email = params.email;
    const password = params.password;

        User.findOne({email: email.toLowerCase()}, (err, user) => {
            if(err){
                res.status(500).send({message: 'Error! Something went wrong'});
            }else{
                if(!user){
                    res.status(404).send({message: 'User not found'});
                }else{
                    //Compare pass
                    bcrypt.compare(password, user.password, (err, check) => {
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
    const userId = req.params.id;
    const update = req.body;

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
    const userId = req.params.id;
    let file_name = 'Not uploaded...';

  if(req.files){
    const file_path = req.files.image.path;
    const file_split = file_path.split('\\');
    file_name = file_split[2];
    const ext_split = file_name.split('\.');
    const file_ext = ext_split[1] ;

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
    const imageFile = req.params.imageFile;
    const path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, (exists) => {
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
