const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  getUserData,
} = require("../controllers/user.controller");
const {
  bookmarkItem,
  getBookmarks,
  deleteBookmark,
} = require("../controllers/bookmark.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

router.post("/bookmark", bookmarkItem);
router.get("/getbookmark", getBookmarks);
router.delete("/deletebookmark", deleteBookmark);
router.post("/signup", signup);
router.post("/login", login);
router.get("/getuser", verifyJWT, getUserData);

module.exports = router;
