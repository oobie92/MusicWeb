'use strict'

const path = require('path');
const fs = require('fs');

const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getSong(req, res){
  const songId = req.params.id;

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
    const albumId = req.params.album;
    let find;

    if(!albumId){
        find = Song.find({}).sort('number');
    }else{
        find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
      path: 'album',
      populate: {
        path: 'artist',
        model: 'Artist'
      }
    }).exec((err, songs) => {
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
    const song = new Song();
    const params = req.body;
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
    const songId = req.params.id;
    const update = req.body;

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
    const songId = req.params.id;

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
    const songId = req.params.id;
    let file_name = 'Not uploaded...';
    console.log(songId)

  if(req.files){
    const file_path = req.files.file.path;
    const file_split = file_path.split('\/');
    file_name = file_split[2];
    const ext_split = file_name.split('\.');
    const file_ext = ext_split[1] ;

        console.log(file_name);
        console.log(file_ext);
        if(file_ext.toLowerCase() == 'mp3' || file_ext == 'wav'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
              if(!songUpdated){
                  console.log(err)
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
    const songFile = req.params.songFile;
    const path_file = './uploads/songs/'+songFile;

    fs.exists(path_file, (exists) => {
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
