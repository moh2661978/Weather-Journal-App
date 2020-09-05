// First of All the main helping code snippets resources are from the Udacity API course itself and by applying what we have learned.
// and also I get help from the first submit review and our mentors on the Udacity Community and GitHub repositorie and outside links like w3school and MDN. I mention all in the readme file.

/*Property of History interface allows web applications to explicitly set default scroll restoration behavior on history navigation https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration*/
window.history.scrollRestoration = 'manual';

/* Global Variables */

// variable to hold the API Call link supports Multilingual support by adding &lang={lang}
const apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?zip=';
// The personal API Key for OpenWeatherMap API is saved in a named const variable.
// used the technique to append the '&appid=' at the first and in the last I append the &units=metric is for Celcius & if For Fahrenheit we should append &units=imperial
const myApiKey = '&appid=0ccbd54b27e7df858d2cf0880f085925&units=metric';
// Create a new date instance dynamically with JS
let d = new Date();
// increase month by 1 because of the returining data was retrieved -1 the current month
let currentDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to add function to exisiting HTML DOM element
document.querySelector('#generate').addEventListener('click', performAction);

// Event Handler function invoked in the event listener onclick
function performAction(event) {
    //Select user feelings value of an input by user to include in POST
    const userFeelings = document.querySelector('#feelings').value;
    // zip code element value by user
    const userZip = document.querySelector('#zip').value;

    // Errors checks on user input
    // to check if the length entered by user equal to 5 digits as the default response from openweather API for USA countries
    if (!Number.isInteger(Number(userZip)) || userZip.length != 5) {
        alert('Zip Code Error: it is empty or incorect. Please Check the code!\nCode Consists of 5 digits');
        return;
    }
    // to check the user input field feelings if least than 3 letters
    if (userFeelings.length < 3) {
        alert('Please, add some description! \natleast 3 letters');
        return;
    }
    // API CALL 
    getWeatherApi(apiUrl, userZip, myApiKey)
        .then((data) => {
            console.log(data);
            // as mentioned in the API Documentaion to extract temp data it's inside main list and use it's Property accessors to get data list main.temp
            // Add data to POST request
            postData('/add', { date: currentDate, temp: data.list[0].main.temp, content: userFeelings })
            // just to call updateUI in the .then() method not out of it, and to be invoked after the postData() returns.
            updateUI();
        })
};
//setTimeout(performAction, 10000); // it invoke the first alert above if user didn't make a request

// getWeatherApi => fetch data from openweathermap API || Integrating OpenWeatherMap API
// Async GET
const getWeatherApi = async (apiUrl, userZip, myApiKey) => {
    //variable to hold the fetch calls return with await to tell don't go anyway untill recieve the data, and await used with async
    //The API Key variable is passed as a parameter to fetch()
    const res = await fetch(apiUrl + userZip + myApiKey)
    // The try, catch and finally statements lets us test a block of code for errors.
    try {
        // API errors as described here https://openweathermap.org/faq
        // We can check for the common errors
        if (res.status === 404) {
            // The throw new Error statement lets create custom errors.
            throw new Error("You make a wrong API request");
        }
        if (res.status === 401) {
            // The throw new Error statement lets create custom errors.
            throw new Error("Unauthorized, PLease check your API Key");
        }
        if (res.status === 429) {
            // The throw new Error statement lets create custom errors.
            throw new Error("You have free tariff and make more than 60 API calls per minute");
        }
        // or we can say if it is not 200 at all then throw an error:
        //If response status 200 The request is OK (this is the standard response for successful HTTP requests)
        /*if (res.status !== 200) {
            throw new Error ("Not 200 response");
        }*/
        //The catch statement lets us handle the error.
    } catch (error) {
        console.log("getWeatherApi", error);
        alert('API Error, Please check the Zip code\nPlease note if country is not specified then the search works for USA as a default');
        return false;
        // finally process data if no errors || Data is successfully returned from the external API.
    } finally {
        const data = await res.json();
        console.log(data);
        return data;
    }
}

// postData => post data to the post route 
// Function to POST data (create a new resource) - POST method implementation
// Async POST
const postData = async (url = '', projectData = {}) => {
    console.log(projectData);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(projectData) //creatJSON string from a JavaScript object
    });

    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("postData", error);
        // appropriately handle the error
        return false;
    }
}

//updateUI => fetch data posted to a certain route in the postData function, and use it together with data collected from user to update UI
// Function to update the UI is the last thing we do to be invoked after the postData() returns.
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        document.querySelector('#date').innerHTML = `Date format M-D-Y: ---> ${allData.date}`;
        document.querySelector('#temp').innerHTML = `Temperature in Celsius: ---> ${Math.round(Number(allData.temp))} &#x2103;`;
        document.querySelector('#content').innerHTML = `It feels:  ${allData.content}`;
    } catch (error) {
        console.log("updateUI", error);
        return false;
    }
}
