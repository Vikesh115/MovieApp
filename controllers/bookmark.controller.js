const User = require('../model/user.model');
const Movie = require('../model/movie.model');
const TV = require('../model/tv.model');

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

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure bookmarks array is defined
        if (!user.bookmarks) {
            user.bookmarks = [];
        }

        // Convert itemId to a consistent type (string) for comparison
        const normalizedItemId = String(itemId);

        // Check if the bookmark already exists
        const existingBookmark = user.bookmarks.find(
            (bookmark) => bookmark.itemId === normalizedItemId && bookmark.type === type
        );

        if (existingBookmark) {
            return res.status(409).json({
                message: "Item already bookmarked",
                bookmark: existingBookmark,
                bookmarks: user.bookmarks,
            });
        }

        // Add the new bookmark
        const newBookmark = { itemId: normalizedItemId, type };
        user.bookmarks.push(newBookmark);
        await user.save();

        return res.status(201).json({
            message: "Item bookmarked successfully",
            bookmark: newBookmark,
            bookmarks: user.bookmarks,
        });
    } catch (error) {
        console.error("Error bookmarking item:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

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

    if (!['movie', 'tv'].includes(type.toLowerCase())) {
        return res.status(400).json({ message: "Invalid type. Must be 'movie' or 'tv'" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User's bookmarks:", JSON.stringify(user.bookmarks, null, 2));
        console.log("Input data:", { userId, itemId, type });

        // Normalize data for comparison
        const normalizedType = type.toLowerCase();
        const index = user.bookmarks.findIndex(
            (bookmark) =>
                String(bookmark.itemId) === String(itemId) &&
                String(bookmark.type).toLowerCase() === normalizedType
        );

        console.log("Index found:", index);

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
