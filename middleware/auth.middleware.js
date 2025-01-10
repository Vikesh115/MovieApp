const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // Extract the token from the Authorization header, removing the "Bearer " prefix
    const token = req.headers['authorization']?.split(' ')[1];  // Get token after "Bearer"
    console.log('Generated token:', token);  // Log the extracted token

    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    try {
        // Verify the token with the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded userId:', decoded.id);  // Log decoded userId
        req.userId = decoded.id;  // Attach the decoded userId to the request
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });  // Handle invalid token
    }
};

module.exports = { verifyJWT };
