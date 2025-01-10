const express = require('express')
const router = express.Router()
const {moviePopulate, getAllMovies, getLatestMovies, getMovieUrl, movieCast} = require('../controllers/movie.controller')

router.get('/populate', moviePopulate)
router.get('/getAllMovie', getAllMovies)
router.get('/getLatestMovie', getLatestMovies)
router.get('/getMovieUrl/:search', getMovieUrl)
router.get('/getMoviecast/:id', movieCast)

module.exports = router;