const movieModel = require('../model/movie.model')
const axios = require('axios');

// movie api 
const apiUrl = "https://api.themoviedb.org/3/discover/movie";
const headers = { Authorization: `Bearer ${process.env.API_KEY}` };

const fetchData = async() => {
    try {
        const response = await axios.get(apiUrl, { headers });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movie data:', error.message);
        return [];
    }
}

// cast api
const fetchCastData = async (movieId) => {
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
        const response = await axios.get(url, {headers});
        return response.data.cast.map(cast => ({
            id: cast.id,
            name: cast.name,
            character: cast.character,
            profile_path: cast.profile_path,
        }));
    } catch (error) {
        console.error('Error fetching cast data:', error.message);
        throw error;
    }
};

// API to get movie by ID and fetch/update cast data
const movieCast =  async (req, res) => {
    const { id } = req.params;

    try {
        // Find movie in the database
        let movie = await movieModel.findOne({ id });

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found in the database.' });
        }

        // Check if cast data exists
        if (!movie.cast || movie.cast.length === 0) {
            // Fetch cast data from TMDB
            const castList = await fetchCastData(id);

            // Update movie with cast data
            movie.cast = castList;
            await movie.save();
        }

        res.json(movie);
    } catch (error) {
        console.error('Error fetching movie or cast data:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// /movie/populate
const moviePopulate =  async (req, res) => {
    try {
        await movieModel.deleteMany();
        const data = await fetchData();
        for (const item of data) {
            const newMovie = new movieModel(item);
            await newMovie.save();
        };
        res.send('Movie Data populated successfully!');
        console.log('Movie Data populated successfully!');
    } catch (error) {
        console.error('Error populating movie data:', error.message);
    }
};

setInterval(moviePopulate, 3600000);


// /movie/getAllMovie
const getAllMovies = async(req,res) =>{
   try {
    const data = await movieModel.find();
    res.status(200).json(data)
    console.log("All movies fetched!!")
   } catch (error) {
    console.log(error);
    res.status(500).json(message)
   }
}

// localhost:8000/movie/getMovieUrl/Absolution
const searchMovie = async (req, res) => {
    try {
        const { search } = req.params;

        // Find the movie matching the search term
        const movie = await movieModel.find({
            title: { $regex: search, $options: 'i' } // Case-insensitive search
        });

        // If no movie is found, return 404
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Return the movie information, including the URL
        res.status(200).json(movie);
    } catch (error) {
        console.error('Error retrieving movie:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {moviePopulate, getAllMovies, searchMovie, movieCast}
