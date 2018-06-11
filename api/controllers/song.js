'use strict'

var path = require('path'),
    fs = require('fs'),

    mongoosePaginate = require('mongoose-pagination'),

    Artist = require('../models/artist'),
    Album = require('../models/album'),
    Song = require('../models/song');

function getSong(req, res){
  var songId = req.params.id;

  Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err){
            res.status(500).send({message: 'Error! Something went wrong'});
        }else{
            if(!song){
                  res.status(404).send({message: 'Song not found'});
            }else{
                  res.status(200).send({song});
            }
        }
  })

}

function getSongs(req, res){
    var albumId = req.params.album;

    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var fing = Song.find({album: albumId}).sort('number');
    }

    find.populate({
      path: 'album',
      populate: {
        path: 'artist',
        model: 'Artist'
      }
    }).exec(function(err, songs){
        if(err){
            res.status(500).send({message: 'Error in Server'});
        }else {
            if(!songs){
                res.status(404).send({message: 'Song not found'});
            }else{
                res.status(200).send({songs});
            }
        }
    });
}

function saveSong(req, res){
    var song = new Song(),
        params = req.body;
        song.number = params.number;
        song.name = params.name;
        song.duration = params.duration;
        song.file = params.file;
        song.album = params.album;

        song.save((err, songStored) => {
            if(err){
                res.status(500).send({message: 'Error in Server'});
            }else{
                if(!songStored){
                    res.status(404).send({message: "Couldn't save song"});
                }else{
                    res.status(200).send({song: songStored});
                }
            }
        });
}

function updateSong(req, res){
    var songId = req.params.id,
        update = req.body;

        Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
          if(err){
              res.status(500).send({message: 'Error in Server'});
          }else{
              if(!songUpdated){
                  res.status(404).send({message: 'Song not updated'});
              }else{
                  res.status(200).send({song: songUpdated});
              }
          }
        });
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
      if(err){
          res.status(500).send({message: 'Error in Server'});
      }else{
          if(!songRemoved){
              res.status(404).send({message: "Couldn't delete song"});
          }else{
              res.status(200).send({song: songRemoved});
          }
      }
    });
}

function uploadFile(req, res){
  var songId = req.params.id,
      file_name = 'Not uploaded...';

  if(req.files){
    var file_path = req.files.file.path,
        file_split = file_path.split('\\'),
        file_name = file_split[2],
        ext_split = file_name.split('\.'),
        file_ext = ext_split[1] ;

        console.log(file_name);
        console.log(file_ext);
        if(file_ext.toLowerCase() == 'mp3' || file_ext == 'wav'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
              if(!songUpdated){
                res.status(404).send({message: "Couldn't update song"});
              }else{
                res.status(200).send({song: songUpdated});
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

function getSongFile(req, res){
    var songFile = req.params.songFile,
        path_file = './uploads/songs/'+songFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Song not found'});
        }
    });

}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};
