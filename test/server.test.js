// npm test

const request = require('supertest');
const app = require('../server'); // Your server file
const mongoose = require('mongoose');

describe('Movie, TV, and Bookmark Controller Tests', () => {
    beforeAll(async () => {
        // Connect to a test database before running the tests
        await mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        // Disconnect from the test database after tests are finished
        await mongoose.connection.close();
    });


    describe("GET movieandtv", () => {
        it("should return a combined list of movies and TV shows", async () => {
            const res = await request(app).get('/movieandtv/getMovieAndTv');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('GET Movie', () => {
        // Test for /movie/getAllMovie
        it("should return a list of movies", async () => {
            const res = await request(app).get('/movie/getAllMovie');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

    });

    // Test for /tv/getAlltv
    describe("GET getAlltv", () => {
        it("should return a list of TV shows", async () => {
            const res = await request(app).get('/tv/getAlltv');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('Bookmark Controller', () => {

        it('should add a new bookmark', async () => {
            const newBookmark = { userId: '6787d76f6e5b1e32ba616067', itemId: 762509, type: 'movie' };
            const response = await request(app).post('/user/bookmark').send(newBookmark);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Item bookmarked successfully');
        });

        it('should delete a bookmark', async () => {
            const bookmarkToDelete = { userId: '6787d76f6e5b1e32ba616067', itemId: 762509, type: 'movie' };
            const response = await request(app).delete('/user/deletebookmark').send(bookmarkToDelete);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Bookmark deleted successfully');
        });

        it('should return error if bookmark not found', async () => {
            const invalidBookmark = { userId: '6787d76f6e5b1e32ba616067', itemId: 999999, type: 'movie' };
            const response = await request(app).delete('/user/deletebookmark').send(invalidBookmark);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Bookmark not found');
        });
    });
});

