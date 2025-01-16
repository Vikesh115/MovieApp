# *AlmaBetter capstone Entertainment App Full Stack Project*

## (*Entertainment App backend*)

> This is a backend part that provides APIs for managing entertainent app website details. This application is developed using Node.Js, express and MongoDB database. 


### APIs

- "/docs" : Get Backend Documentation.
- "/" : This default route will render "index.html" file.
- "/subscribers" : This will respond with an array of subscribers.
- "/subscribers/name" : This will respond with an array of subscribers with only two fields, name and subscribedChannel.
- "/subscribers/:id : This will response with the details of subscriber whose id is provided.


### Prerequisites (Installation)
- VSCode  (https://code.visualstudio.com/download)
- Node.Js (https://nodejs.org/en)
- MongoDB (https://www.mongodb.com/try/download/shell)

### Dependencies
- Node.js
- express
- mongoose
- nodemon
- MongoDb

### devDependencies
- jest
- supertest
- swagger-jsdoc
- swagger-ui-express

### Run
Git commands: 

git clone  https://github.com/Vikesh115/Youtube-Subscribers-Project.git
npm istall

node src/createDatabase.js
nodemon index.js

### test
- npx jest

### Project created by
Vikesh Raut

### Thank you
