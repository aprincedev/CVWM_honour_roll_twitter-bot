const Twit = require("twit");
const config = require("./config");
const fetch = require("node-fetch");
const schedule = require('node-schedule');

//Configure Twitter API with const T
const T = new Twit(config);


//Fetch from CVWM API
const getPosts = () => {
    return fetch("https://www.veterans.gc.ca/xml/jsonp/app.cfc?method=remoteGetHonourRoll&language=en")
    .then(res => res.json())
    .then(posts => createTweetsBody(posts))
}

//Use the 'posts' response to loop through each soldier and compose the body of each tweet
function createTweetsBody(posts) {
    let dayTweetBody = `Today's Honour Roll recognizes ${posts.days.length} Canadians who fell on this day in history. View the CVWM Honour Roll here: https://www.veterans.gc.ca/eng/remembrance/memorials/canadian-virtual-war-memorial/honour-roll`;
 
    //Tweet out initial daily tweet
    let dayTweet = {
        status: dayTweetBody
    }
    
    T.post('statuses/update', dayTweet, dailyTweet);
    
    function dailyTweet(err, data, response) {
        if (err) {
            console.log(err);
        } else {
        console.log(data.text);
        }}

    //Interval function to schedule tweets every 5 min.
    let counter = 0;
    setInterval(function(){
        if(counter < posts.days.length) {
        let initTweetBody = `${posts.days[counter].FORENAMES} ${posts.days[counter].SURNAME}, who fell on this day in ${posts.days[counter].DATE_OF_DEATH.substring(0,4)}.`;
        
        let initTweet = {
        status: initTweetBody
    }
    
        T.post('statuses/update', initTweet, intervalTweet);
        function intervalTweet(err, data, response) {
            if (err) {
                console.log(err);
            } else {
            console.log(data.text);
            }}
        
        counter++;
        }
    }, 300000);

    }

//Call the function each midnight to fetch the API and load tweets
//getPosts();
schedule.scheduleJob('0 0 * * *', () => { getPosts(); }) 

