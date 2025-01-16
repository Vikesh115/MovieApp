const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const signup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error signing up:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        // Attempt to read the token from cookies or headers
        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: 'Token not found, cannot logout' });
        }

        // Clear the token cookie if present
        if (req.cookies?.token) {
            res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
        }

        // If using a token blacklist, add the token here
        // Example: blacklist.push(token);

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).json({ message: 'Server error during logout' });
    }
};

const getUserData = async (req, res) => {
    try {
        console.log('UserId from token:', req.userId);  // Log the userId
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User data retrieved", user });
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { signup, login, logout, getUserData };
