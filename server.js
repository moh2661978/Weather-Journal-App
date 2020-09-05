// Setup empty JS object to act as endpoint for all app data
projectData = {};

//Express to run server and routes
const express = require('express');
// The Express app instance pointed to the project folder with server.js file
// Start up an instance of app
const app = express();

// Dependencies
const bodyParser = require('body-parser')

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance to allow browser and server talk to each other without any securty interuptions
const cors = require('cors');
app.use(cors());

// Initialize the main project folder and pointing our express app to our folder we want them to look at
app.use(express.static('website'));

// Setup Server
const port = 8000;

// Spin up the server
const server = app.listen(port, () => { console.log(`running on localhost: ${port}`) })

// GET all route (get data from server) when a server get request from the app the server send the projects data
//Get Route / sending Data to a certain route url /all.
app.get('/all', sendData);
//Request and Response Parameters The req parameter signifies the "request" from the client to the server. The res parameter signifies the "response" from the server to the client.
function sendData(req, res) {
    //Send a response of various types.
    // respond with JS object "projectdata" when a GET request is made to the homepage
    //line of code that will return our JavaScript object when the GET request is made.
    res.send(projectData);
    //console.log(projectData);
};

/*.The variable projectData now acts as the endpoint for all our app data.Later we will work on how to POST data to the app endpoint.*/

// POST route to add data - Post Route: adding acquired data to endpoint object.
app.post('/add', addData);
//In the callback function, add the data received from req.body
function addData(req, res) {
    // a variable to hold all the requested data with the dot notation
    let newData = req.body;
    //Since projectData is an object, push is not a method for the object.
    projectData = newData;
    // consol log on server screen projectdata
    console.log({ projectData });
    // send the response of requested to projectdata
    res.send(projectData);
};
