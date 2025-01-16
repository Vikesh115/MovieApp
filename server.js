const express = require("express");
require("dotenv").config();
const app = express();
const database = require("./config/db.js");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

module.exports = app;

const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API endpoints for movies, TV shows, and users",
      contact: {
        name: "Vikesh raut", // Replace with your name
        email: "vikeshraut952@gmail.com", // Replace with your email
        url: "https://movie-app-frontend-olive.vercel.app/", // Optional: Your website/portfolio link
      },
    },
    servers: [
      {
        url: "https://movieapp-tu5n.onrender.com", // Replace 3000 with your local port if different
        description: "Production server",
      },
      {
        url: "https://your-local-url", // Replace with your production deployment link
        description: "Local server",
      },
    ],
    paths: {
      "/movie/getAllMovie": {
        get: {
          summary: "Get all movies",
          responses: {
            200: {
              description: "A list of movies",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        genre: { type: "string" },
                        releaseYear: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/tv/getAlltv": {
        get: {
          summary: "Get all TV shows",
          responses: {
            200: {
              description: "A list of TV shows",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        genre: { type: "string" },
                        seasons: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/movieandtv/getMovieAndTv": {
        get: {
          summary: "Get all movies and TV shows",
          responses: {
            200: {
              description: "A combined list of movies and TV shows",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        type: { type: "string", enum: ["movie", "tv"] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // No need to include files since all documentation is in the definition
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middlewares
app.use(express.json());
app.use(cors());
app.options("*", cors());

// Swagger UI setup
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database connection
database();

// API endpoints
const movieRoute = require("./routes/movie.route.js");
const tvRoute = require("./routes/tv.route.js");
const userRoute = require("./routes/user.route.js");
const TvorMovie = require("./routes/allTvAndMovie.route");

app.use("/movie", movieRoute);
app.use("/tv", tvRoute);
app.use("/user", userRoute);
app.use("/movieandtv", TvorMovie);

app.get("/", (req, res) => res.send("All API endpoints are working!"));

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});









// const express = require("express");
// require("dotenv").config();
// const app = express();
// const database = require("./config/db.js");
// const cors = require("cors");

// module.exports = app;

// const PORT = process.env.PORT || 3000;

// // middlewares
// app.use(express.json());
// app.use(cors());
// app.options("*", cors());

// // db connection
// database();

// // api endpoints
// const movieRoute = require("./routes/movie.route.js");
// const tvRoute = require("./routes/tv.route.js");
// const userRoute = require("./routes/user.route.js");
// const TvorMovie = require('./routes/allTvAndMovie.route')

// app.use("/movie", movieRoute);
// app.use("/tv", tvRoute);
// app.use("/user", userRoute);
// app.use("/movieandtv", TvorMovie);

// app.get("/", (req, res) => res.send("All API endpoint is working!"));

// app.listen(PORT, () => {
//   console.log("server started", PORT);
// });
