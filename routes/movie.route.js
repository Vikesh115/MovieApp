const express = require('express')
const router = express.Router()
const {moviePopulate, getAllMovies, getLatestMovies, getMovieUrl, movieCast} = require('../controllers/movie.controller')
const {verifyJWT} = require('../middleware/auth.middleware')

router.get('/populate', moviePopulate)
router.get('/getAllMovie', getAllMovies)
router.get('/getLatestMovie', getLatestMovies)
router.get('/getMovieUrl/:search', getMovieUrl)
router.get('/getMoviecast/:id',verifyJWT, movieCast)

module.exports = router;