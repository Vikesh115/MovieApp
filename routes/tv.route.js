const express = require('express')
const router = express.Router()
const {tvPopulate, getAllTvs, getLatestTvs, getTvUrl, tvCast} = require('../controllers/tv.controller')

router.get('/populate', tvPopulate)
router.get('/getAlltv', getAllTvs)
router.get('/getLatestTvs', getLatestTvs)
router.get('/getTvUrl/:search', getTvUrl)
router.get('/getTvcast/:id', tvCast)

module.exports = router

