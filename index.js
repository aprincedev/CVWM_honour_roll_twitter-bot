console.log("Bot is starting");

const Twit = require("twit");
const config = require("./config");
const fetch = require("node-fetch");


//var T = new Twit(config);

//Fetch from CVWM API and set each soldier to an array
const getPosts = () => {
    return fetch("https://www.veterans.gc.ca/xml/jsonp/app.cfc?method=remoteGetHonourRoll&language=en")
    .then(res => res.json())
    .then(posts => createTweetsBody(posts))
}

//Create the entire honour roll for the day (JSON objects), store it in an array 
function createTweetsBody(posts) {
        let tweetArr = [];
    posts.days.forEach(function(post) {
        tweetArr.push(`${post.FORENAMES} ${post.SURNAME} - ${post.DATE_OF_DEATH.substring(0, 4)}, `);        
    });
    splitTweetsBody(tweetArr);
}

//Now we have the entire array of names, now split them up into individual tweets (280 characters) for Twitter
function splitTweetsBody(tweetArr) {        
    //console.log(tweetArr);
    console.log(tweetArr.slice(0,4));
}

//Call the function to fetch the API and load tweets
getPosts();

