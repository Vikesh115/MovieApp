const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    bookmarks: [
        {
            itemId: Number, // ID of the movie or TV show
            type: { type: String, enum: ['movie', 'tv'], required: true } // Type discriminator
        }
    ],
});

module.exports = mongoose.model('user', userSchema);


// https://api.themoviedb.org/3/movie/558449/credits
// https://api.themoviedb.org/3/tv/93405/credits