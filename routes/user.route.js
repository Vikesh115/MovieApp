const express = require('express')
const router = express.Router()
const {login, signup, logout, getUserData} = require('../controllers/user.controller')
const {bookmarkItem, getBookmarks, deleteBookmark} = require('../controllers/bookmark.controller')
const {verifyJWT} = require('../middleware/auth.middleware')

router.post('/bookmark', verifyJWT, bookmarkItem)
router.get('/getbookmark', verifyJWT, getBookmarks)
router.delete('/deletebookmark', verifyJWT, deleteBookmark)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", verifyJWT, logout)
router.get("/getuser",verifyJWT, getUserData)

module.exports = router;