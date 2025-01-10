const mongoose = require('mongoose')

const movieModel = mongoose.Schema({
    "adult": Boolean,
    "backdrop_path": String,
    "genre_ids": Array,
    "id": Number,
    "original_language": String,
    "original_title": String,
    "overview": String,
    "popularity": Number,
    "poster_path": String,
    "release_date": Date,
    "title": String,
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

module.exports = mongoose.model('movie', movieModel)
