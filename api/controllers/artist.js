'use strict'

const path = require('path');
const fs = require('fs');

const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getArtist(req, res){
    const artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err){
          res.status(500).send({message: 'Error! Something went wrong'});
        }else{
            if(!artist){
              res.status(404).send({message: 'Artist not found'});
            }else{
              res.status(200).send({artist});
            }
        }

    });
}

function getArtists(req, res){
  let page;
    if(req.params.page){
    page = req.params.page;
  }else{
    page = 1
  }
    const  itemsPerPage = 5;

        Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
            if(err){
                res.status(500).send({message: 'Error in Server'});
            }else{
                if(!artists){
                  res.status(404).send({message: 'Artist not found'});
                }else{
                  return res.status(200).send({
                      total_items: total,
                      artist: artists
                  });
                }
            }
        });

}

function saveArtist(req, res){
    const artist = new Artist(),

    params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
      if(err){
        res.status(500).send({message: 'Error while saving artist'});
      }else{
          if(!artistStored){
              res.status(404).send({message: 'Artista not saved'});
          }else{
              res.status(200).send({artist: artistStored});
          }
      }
    });
}

function updateArtist(req, res){
    const artistId = req.params.id,
        update = req.body;

        Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
            if(err){
                res.status(500).send({message: 'Error while updating artist'});
            }else{
                if(!artistUpdated){
                    res.status(404).send({message: 'Artist not updated'});
                }else{

                    res.status(200).send({artist: artistUpdated});
                }
            }
        });

}

function deleteArtist(req, res){
    const artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
          res.status(500).send({message: 'Error while deleting artist'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'Artista not removed'});
            }else{
                console.log();


                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
                  if(err){
                    res.status(500).send({message: 'Error while deleting album'});
                  }else{
                      if(!albumRemoved){
                          res.status(404).send({message: 'Album not removed'});
                      }else{

                          Song.find({artist: artistRemoved._id}).remove((err, songRemoved) => {

                          if(err){
                                res.status(500).send({message: 'Error while deleting song'});
                          }else{
                              if(!songRemoved){
                                    res.status(404).send({message: 'Song not removed'});
                              }else{
                                    res.status(200).send({artist: artistRemoved});
                              }
                        }
                });
              }
          }
        });
      }
    }
  });
}

function uploadImage(req, res){
  const artistId = req.params.id;
  let file_name = 'Not uploaded...';

  if(req.files){
    const file_path = req.files.image.path;
    const file_split = file_path.split('\/');
    file_name = file_split[2];
    const ext_split = file_name.split('\.');
    const file_ext = ext_split[1] ;

        console.log(file_name);
        console.log(file_ext);
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
              if(!artistUpdated){
                res.status(404).send({message: "Couldn't update user"});
              }else{
                res.status(200).send({artist: artistUpdated});
              }
            });

        }else{
            res.status(200).send({message: 'Extension not valid'});
        }

    }else{
    res.status(200).send({message: 'Select an image'});

    console.log(file_path);
  }


}

function getImageFile(req, res){
    var imageFile = req.params.imageFile,
        path_file = './uploads/artists/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Image not found'});
        }
    });

}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}
