const express = require('express')
const router = express.Router()
const {tvPopulate, getAllTvs, searchTv, tvCast} = require('../controllers/tv.controller')

router.get('/populate', tvPopulate)
router.get('/getAlltv', getAllTvs)
router.get('/getTv/:search', searchTv)
router.get('/getTvcast/:id', tvCast)

module.exports = router

