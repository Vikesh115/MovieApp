const tvModel = require('../model/tv.model')
const axios = require('axios');

const apiUrl = "https://api.themoviedb.org/3/discover/tv";
const headers = { Authorization: `Bearer ${process.env.API_KEY}` };

// fetch tv api
const fetchData = async() => {
    try {
        const response = await axios.get(apiUrl, { headers });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching TV data:', error.message);
        return [];
    }
}

// cast api
const fetchCastData = async (tvId) => {
    try {
        const url = `https://api.themoviedb.org/3/tv/${tvId}/credits`;
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
const tvCast =  async (req, res) => {
    const { id } = req.params;

    try {
        // Find movie in the database
        let tv = await tvModel.findOne({ id });

        if (!tv) {
            return res.status(404).json({ message: 'Tv not found in the database.' });
        }

        // Check if cast data exists
        if (!tv.cast || tv.cast.length === 0) {
            // Fetch cast data from TMDB
            const castList = await fetchCastData(id);

            // Update movie with cast data
            tv.cast = castList;
            await tv.save();
        }

        res.json(tv);
    } catch (error) {
        console.error('Error fetching tv or cast data:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// /tv/populate
const tvPopulate =  async (req, res) => {
    try {
        await tvModel.deleteMany();
        const data = await fetchData();
        for (const item of data) {
            const newTv = new tvModel(item);
            await newTv.save();
        };
        res.send('TV Data populated successfully!');
        console.log('TV Data populated successfully!');
    } catch (error) {
        console.error('Error populating TV data:', error.message);
    }
};

const getAllTvs = async(req,res) =>{
   try {
    const data = await tvModel.find();
    res.status(200).json(data)
    console.log("All tvs fetched!!")
   } catch (error) {
    console.log(error);
    res.status(500).json(message)
   }
}

const getLatestTvs = async (req, res) => {
    try {
        const { search } = req.query;

        // Build query based on the search parameter
        const query = search
            ? { title: { $regex: search, $options: 'i' } } // Case-insensitive search
            : {};

        // Fetch latest 14 tvs sorted by popularity in descending order
        const tvs = await tvModel
            .find(query)
            .sort({ popularity: -1 })
            .limit(14);

        // If no movies found, return 404
        if (tvs.length === 0) {
            return res.status(404).json({ message: 'Tv Not Found' });
        }

        // Return movies with a 200 status
        res.status(200).json({ tvs });
    } catch (error) {
        console.error('Error fetching tvs :', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// localhost:8000/tv/getTvUrl/Absolution
const getTvUrl = async (req, res) => {
    try {
        const { search } = req.params;

        // Find the tv matching the search term
        const tv = await tvModel.findOne({
            name: { $regex: search, $options: 'i' } // Case-insensitive search
        });

        // If no tv is found, return 404
        if (!tv) {
            return res.status(404).json({ message: 'Tv not found' });
        }

        // Return the tv information, including the URL
        res.status(200).json(tv);
    } catch (error) {
        console.error('Error retrieving tv:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { tvPopulate, getAllTvs, getLatestTvs, getTvUrl, tvCast }