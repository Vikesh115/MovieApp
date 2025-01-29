const User = require('../model/user.model');
const Movie = require('../model/movie.model');
const TV = require('../model/tv.model');
const TvAndMovie = require('../model/allTvAndMovie.model')

// get
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

        const { bookmarks } = user;

        if (user.bookmarks.length === 0) {
            return res.status(409).json({ message: "No bookmarks found for this user" });
        }

        console.log(user.bookmarks.length);

        const movieIds = bookmarks.filter(b => b.type === 'movie').map(b => b.itemId);
        const tvIds = bookmarks.filter(b => b.type === 'tv').map(b => b.itemId);
        const tvAndMovieIds = bookmarks.filter(b => b.type === 'tvAndMovie').map(b => b.itemId); // Add this line to filter tvAndMovie bookmarks

        // Fetch movies, tv shows, and tvAndMovie entries in parallel
        const [movies, tvShows, tvAndMovies] = await Promise.all([
            Movie.find({ id: { $in: movieIds } }),
            TV.find({ id: { $in: tvIds } }),
            TvAndMovie.find({ id: { $in: tvAndMovieIds } })  // Query TvAndMovie model
        ]);

        res.status(200).json({
            message: "Bookmarks retrieved successfully",
            bookmarks: {
                movies,
                tv: tvShows,
                tvAndMovie: tvAndMovies,  // Include tvAndMovie in the response
            },
        });
    } catch (error) {
        console.error("Error retrieving bookmarks:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const toggleBookmark = async (req, res) => {
    const { userId, itemId, type } = req.body;

    if (!userId || !itemId || !type) {
        return res.status(400).json({ message: "User ID, Item ID, and Type are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Convert itemId to a string for consistency
        const normalizedItemId = String(itemId);

        // Check if the bookmark exists
        const existingBookmarkIndex = user.bookmarks.findIndex(
            (bookmark) => String(bookmark.itemId) === normalizedItemId && bookmark.type === type
        );

        if (existingBookmarkIndex !== -1) {
            // If the bookmark exists, remove it (toggle off)
            user.bookmarks.splice(existingBookmarkIndex, 1);
            await user.save();
            return res.status(200).json({ message: "Bookmark removed successfully", bookmarks: user.bookmarks });
        }

        // If the bookmark does not exist, add it (toggle on)
        const newBookmark = { itemId: normalizedItemId, type };
        user.bookmarks.push(newBookmark);
        await user.save();

        return res.status(201).json({ message: "Bookmark added successfully", bookmarks: user.bookmarks });
    } catch (error) {
        console.error("Error toggling bookmark:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// const bookmarkItem = async (req, res) => {
//     const { userId, itemId, type } = req.body;

//     if (!userId || !itemId || !type) {
//         return res.status(400).json({ message: "User ID, Item ID, and Type are required" });
//     }

//     if (!['movie', 'tv', 'tvAndMovie'].includes(type)) {
//         return res.status(400).json({ message: "Invalid type. Must be 'movie' or 'tv'" });
//     }

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Ensure bookmarks array is defined
//         if (!user.bookmarks) {
//             user.bookmarks = [];
//         }

//         // Convert itemId to a consistent type (string) for comparison
//         const normalizedItemId = String(itemId);

//         // Check if the bookmark already exists
//         const existingBookmark = user.bookmarks.find(
//             (bookmark) => bookmark.itemId === normalizedItemId && bookmark.type === type
//         );

//         if (existingBookmark) {
//             return res.status(409).json({
//                 message: "Item already bookmarked",
//                 bookmark: existingBookmark,
//                 bookmarks: user.bookmarks,
//             });
//         }

//         // Add the new bookmark
//         const newBookmark = { itemId: normalizedItemId, type };
//         user.bookmarks.push(newBookmark);
//         await user.save();

//         return res.status(201).json({
//             message: "Item bookmarked successfully",
//             bookmark: newBookmark,
//             bookmarks: user.bookmarks,
//         });
//     } catch (error) {
//         console.error("Error bookmarking item:", error);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };


// const deleteBookmark = async (req, res) => {
//     const { userId, itemId, type } = req.body;

//     if (!userId || !itemId || !type) {
//         return res.status(400).json({ message: "User ID, Item ID, and Type are required" });
//     }

//     if (!['movie', 'tv'].includes(type.toLowerCase())) {
//         return res.status(400).json({ message: "Invalid type. Must be 'movie' or 'tv'" });
//     }

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         console.log("User's bookmarks:", JSON.stringify(user.bookmarks, null, 2));
//         console.log("Input data:", { userId, itemId, type });

//         // Normalize data for comparison
//         const normalizedType = type.toLowerCase();
//         const index = user.bookmarks.findIndex(
//             (bookmark) =>
//                 String(bookmark.itemId) === String(itemId) &&
//                 String(bookmark.type).toLowerCase() === normalizedType
//         );

//         console.log("Index found:", index);

//         if (index === -1) {
//             return res.status(404).json({ message: "Bookmark not found" });
//         }

//         // Remove the bookmark
//         user.bookmarks.splice(index, 1);
//         await user.save();

//         return res.status(200).json({ message: "Bookmark deleted successfully", bookmarks: user.bookmarks });

//     } catch (error) {
//         console.error("Error deleting bookmark:", error.message);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };

const searchBookmark = async (req, res) => {
    try {
        const { userId, search } = req.body;

        // Validate inputs
        if (!userId || !search) {
            return res.status(400).json({ message: "User ID and search term are required" });
        }

        // Find the user and ensure they exist
        const user = await User.findById(userId);
        console.log("User Bookmarks:", user.bookmarks);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has bookmarks
        if (!user.bookmarks || user.bookmarks.length === 0) {
            return res.status(404).json({ message: "No bookmarks found for this user" });
        }

        // Filter the bookmarks by type
        const movieIds = user.bookmarks
            .filter((bookmark) => bookmark.type === 'movie')
            .map((bookmark) => bookmark.itemId);

        console.log(movieIds);

        const tvIds = user.bookmarks
            .filter((bookmark) => bookmark.type === 'tv')
            .map((bookmark) => bookmark.itemId);

        console.log(tvIds);

        // Search in bookmarked movies and TV shows based on the search term
        const searchTerm = search.trim(); // Trim any leading or trailing spaces
        const matchingMovies = await Movie.find({
            id: { $in: movieIds },
            title: { $regex: searchTerm, $options: 'i' },
        });

        const matchingTVs = await TV.find({
            id: { $in: tvIds },
            name: { $regex: searchTerm, $options: 'i' },
        });

        console.log("Search Term:", search);
        console.log("Movie IDs:", movieIds);
        console.log("TV IDs:", tvIds);

        // Combine the results
        const results = {
            movies: matchingMovies,
            tvShows: matchingTVs,
        };

        // Check if any results match the search term
        if (matchingMovies.length === 0 && matchingTVs.length === 0) {
            return res.status(404).json({ message: "No bookmarks found matching the search term" });
        }

        return res.status(200).json({
            message: "Bookmarks retrieved successfully",
            results,
        });
    } catch (error) {
        console.error("Error searching bookmarks:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



module.exports = { getBookmarks, toggleBookmark, searchBookmark };
