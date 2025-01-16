const express = require('express');
const router = express.Router();
const {movieAndTvPopulate, getMovieAndTv ,searchMovieOrTv} = require('../controllers/allMovieAndTv.controller');

router.get('/populate', movieAndTvPopulate);
router.get('/getMovieAndTv', getMovieAndTv);
router.get('/getTvorMovie/:search',searchMovieOrTv);

module.exports = router;