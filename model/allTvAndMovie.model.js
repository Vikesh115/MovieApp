const mongoose = require('mongoose')

const allTvandMovieSchema = mongoose.Schema({
        "backdrop_path": String,
        "id": Number,
        "title": String,
        "name": String,
        "original_title": String,
        "overview": String,
        "poster_path": String,
        "media_type": String,
        "adult": Boolean,
        "original_language": String,
        "genre_ids": Array,
        "popularity": Number,
        "release_date": Date,
        "first_air_date": Date,
        "video": Boolean,
        "vote_average": Number,
        "vote_count": Number,
    })

module.exports = mongoose.model('tvandmovie', allTvandMovieSchema)