const express = require("express");
require("dotenv").config();
const app = express();
const database = require("./config/db.js");
const cors = require("cors");

module.exports = app;

const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());

// db connection
database();

// api endpoints
const movieRoute = require("./routes/movie.route.js");
const tvRoute = require("./routes/tv.route.js");
const userRoute = require("./routes/user.route.js");
const TvorMovie = require('./routes/allTvAndMovie.route')

app.use("/movie", movieRoute);
app.use("/tv", tvRoute);
app.use("/user", userRoute);
app.use("/movieandtv", TvorMovie);

app.get("/", (req, res) => res.send("All API endpoint is working!"));

app.listen(PORT, () => {
  console.log("server started", PORT);
});
