'use strict'

const path = require('path');
const fs = require('fs'); //Return file, in this case images

const mongoosePaginate = require('mongoose-pagination'); //pagination module

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getAlbum(req, res){
    const albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            console.log(err)
            res.status(500).send({message: 'Error! Something went wrong'});
        }else {

            if(!album){
                res.status(404).send({message: 'Album not found'});
            }else{
                res.status(200).send({album});
            }
        }
    });


}

function saveAlbum(req, res){
    const album = new Album();

    const params = req.body;

        album.title = params.title;
        album.description = params.description;
        album.year = params.year;
        album.image = 'null';
        album.artist = params.artist;

        album.save((err, albumStored) => {
            if(err){
                res.status(500).send({message: 'Error in Server'});
            }else{

                if(!albumStored){
                    res.status(404).send({message: "Couldn't save album"});
                }else{
                    res.status(200).send({album: albumStored});
                }
            }
        })

}

function getAlbums(req, res){
    const artistId = req.params.artist;
    let find;

    if(!artistId){
      //Sacar todos los albums de la bbdd
      find = Album.find({}).sort('title');
    }else{
      //Sacar los albums de un artista concreto de la base de datos
      find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err){
            res.status(500).send({message: 'Error! Something went wrong'});
        }else{

            if(!albums){
                res.status(404).send({message: 'Album not found'});
            }else{

              res.status(200).send({albums});
            }
        }

    });
}

function updateAlbum(req, res){
    const albumId = req.params.id;
    const update = req.body;

        Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
          if(err){
              res.status(500).send({message: 'Error! Something went wrong'});
          }else {

              if(!albumUpdated){
                    res.status(404).send({message: "Couldn't update album"});
              }else {
                    res.status(200).send({album: albumUpdated});
              }
          }
        })
}

function deleteAlbum(req, res){
    const albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
      if(err){
        res.status(500).send({message: 'Error while deleting album'});
      }else{
          if(!albumRemoved){
              res.status(404).send({message: 'Album not removed'});
          }else{

              Song.find({artist: albumRemoved._id}).remove((err, songRemoved) => {

              if(err){
                    res.status(500).send({message: 'Error while deleting song'});
              }else{
                  if(!songRemoved){
                        res.status(404).send({message: 'Song not removed'});
                  }else{
                        res.status(200).send({album: albumRemoved});
                  }
            }
    });
  }
}
});

}

function uploadImage(req, res){
    const albumId = req.params.id;
    let file_name = 'Not uploaded...';

  if(req.files){
    const file_path = req.files.image.path;
    const file_split = file_path.split('\/');


    file_name = file_split[2];
    const ext_split = file_name.split('\.');
    const file_ext = ext_split[1];

        console.log(file_name);
        console.log(file_ext);
        if(file_ext.toLowerCase() == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
              if(!albumUpdated){
                res.status(404).send({message: "Couldn't update Album"});
              }else{
                res.status(200).send({album: albumUpdated});
              }
            });

        }else{
            res.status(200).send({message: 'Extension not valid'});

        }

    }else{
    res.status(200).send({message: 'Most upload Image'});

    console.log(file_path);
  }


}

function getImageFile(req, res){
    const imageFile = req.params.imageFile,
        path_file = './uploads/albums/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Image not found'});
        }
    });

}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}
