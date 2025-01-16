const express = require('express')
const router = express.Router()
const {moviePopulate, getAllMovies, searchMovie, movieCast} = require('../controllers/movie.controller')

router.get('/populate', moviePopulate)
router.get('/getAllMovie', getAllMovies)
router.get('/getMovie/:search', searchMovie)
router.get('/getMoviecast/:id', movieCast)

module.exports = router;