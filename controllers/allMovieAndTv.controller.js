const allTvAndMovieModel = require('../model/allTvAndMovie.model');
const axios = require('axios')

const apiUrl = "https://api.themoviedb.org/3/trending/all/day";
const headers = { Authorization: `Bearer ${process.env.API_KEY}` };

const fetchData = async () => {
    try {
        const response = await axios.get(apiUrl, { headers });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movie data:', error.message);
        return [];
    }
}

// /movieAndTv/populate
const movieAndTvPopulate = async (req, res) => {
    try {
        await allTvAndMovieModel.deleteMany();
        const data = await fetchData();
        for (const item of data) {
            const newMovie = new allTvAndMovieModel(item);
            await newMovie.save();
        };
        res.send('Movie and Tv Data populated successfully!');
        console.log('Movie and Tv Data populated successfully!');
    } catch (error) {
        console.error('Error populating movie and tv data:', error.message);
    }
};

// /movie/getAllMovieAndTv
const getMovieAndTv = async (req, res) => {
    try {
        const data = await allTvAndMovieModel.find();
        res.status(200).json(data)
        console.log("All movies and tvs fetched!!")
    } catch (error) {
        console.log(error);
        res.status(500).json(message)
    }
}

const searchMovieOrTv = async (req, res) => {
    try {
        const { search } = req.params;

        // Find the movie matching the search term
        const movieortv = await allTvAndMovieModel.find(
            {
                $or: [{ name: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }]
            }
        );

        // If no movie is found, return 404
        if (!movieortv) {
            return res.status(404).json({ message: 'Movie or Tv not found' });
        }

        // Return the movie information, including the URL
        res.status(200).json(movieortv);
    } catch (error) {
        console.error('Error retrieving movie or Tv:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getDetails = async (req,res) =>{
    const { id } = req.params;
    
        try {
            // Find movie in the database
            let detail = await allTvAndMovieModel.findOne({ id });
    
            if (!detail) {
                return res.status(404).json({ message: 'Detail not found in the database.' });
            }
            res.json(detail);
        } catch (error) {
            console.error('Error fetching data:', error.message);
            res.status(500).json({ message: 'Internal server error.' });
        }
}

module.exports = { movieAndTvPopulate, getMovieAndTv, searchMovieOrTv, getDetails }