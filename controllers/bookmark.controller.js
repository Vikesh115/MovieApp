const User = require('../model/user.model');

const bookmarkItem = async (req, res) => {
    const { userId, itemId, type } = req.body;

    if (!userId || !itemId || !type) {
        return res.status(400).json({ message: "User ID, Item ID, and Type are required" });
    }

    if (!['movie', 'tv'].includes(type)) {
        return res.status(400).json({ message: "Invalid type. Must be 'movie' or 'tv'" });
    }

    try {
        const user = await User.findById(userId);
        console.log("User found:", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Initialize bookmarks if undefined
        if (!user.bookmarks) {
            user.bookmarks = [];
        }

        const existingBookmark = user.bookmarks.find(
            (bookmark) => bookmark.itemId === itemId && bookmark.type === type
        );

        if (!existingBookmark) {
            user.bookmarks.push({ itemId, type });
            await user.save();
            console.log("Bookmark added successfully:", user.bookmarks);
            return res.status(200).json({ message: "Item bookmarked successfully", bookmarks: user.bookmarks });
        }

        console.log("Bookmark already exists:", user.bookmarks);
        return res.status(200).json({ message: "Item already bookmarked", bookmarks: user.bookmarks });
    } catch (error) {
        console.error("Error bookmarking item:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



const Movie = require('../model/movie.model');
const TV = require('../model/tv.model');

const getBookmarks = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.bookmarks.length === 0) {
            return res.status(409).json({ message: "No bookmarks found for this user" });
        }

        const movieBookmarks = await Movie.find({ id: { $in: user.bookmarks.filter(b => b.type === 'movie').map(b => b.itemId) } });
        const tvBookmarks = await TV.find({ id: { $in: user.bookmarks.filter(b => b.type === 'tv').map(b => b.itemId) } });

        return res.status(200).json({
            message: "Bookmarks retrieved successfully",
            bookmarks: { movies: movieBookmarks, tv: tvBookmarks },
        });
    } catch (error) {
        console.error("Error retrieving bookmarks:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


const deleteBookmark = async (req, res) => {
    const { userId, itemId, type } = req.body;

    if (!userId || !itemId || !type) {
        return res.status(400).json({ message: "User ID, Item ID, and Type are required" });
    }

    if (!['movie', 'tv'].includes(type)) {
        return res.status(400).json({ message: "Invalid type. Must be 'movie' or 'tv'" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find and remove the bookmark based on itemId and type
        const index = user.bookmarks.findIndex(
            (bookmark) => bookmark.itemId === itemId && bookmark.type === type
        );

        if (index === -1) {
            return res.status(404).json({ message: "Bookmark not found" });
        }

        // Remove the bookmark
        user.bookmarks.splice(index, 1);
        await user.save();

        return res.status(200).json({ message: "Bookmark deleted successfully", bookmarks: user.bookmarks });

    } catch (error) {
        console.error("Error deleting bookmark:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



module.exports = { bookmarkItem, getBookmarks, deleteBookmark };
