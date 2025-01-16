const mongoose = require('mongoose')

const tvModel = mongoose.Schema({
    "adult": Boolean,
    "backdrop_path": String,
    "genre_ids": Array,
    "id": Number,
    "origin_country": Array,
    "original_language": String,
    "original_name": String,
    "overview": String,
    "popularity": Number,
    "poster_path": String,
    "first_air_date": Date,
    "name": String,
    "vote_average": Number,
    "vote_count": Number,
    "media_type": { type: String, default: 'tv'},
    "cast": [
        {
            id: Number, // TMDB Cast ID
            name: String, // Cast member's name
            character: String, // Character name
            profile_path: String // Profile image path
        }
    ]
})

module.exports = mongoose.model('tv', tvModel)