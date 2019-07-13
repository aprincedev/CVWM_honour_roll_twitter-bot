console.log("Bot is starting");

const Twit = require("twit");
const config = require("./config");


var T = new Twit(config);