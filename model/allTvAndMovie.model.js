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
        "cast": [
        {
            id: Number, // TMDB Cast ID
            name: String, // Cast member's name
            character: String, // Character name
            profile_path: String // Profile image path
        }
    ]
    })

module.exports = mongoose.model('tvandmovie', allTvandMovieSchema)