"use strict";

const Twitter = require("twitter-lite");

module.exports = credentials =>
  new Twitter({
    subdomain: "api",
    consumer_key: credentials.consumerKey,
    consumer_secret: credentials.consumerSecret,
    access_token_key: credentials.accessTokenKey,
    access_token_secret: credentials.accessTokenSecret
  });
