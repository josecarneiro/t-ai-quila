"use strict";

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET
} = process.env;

module.exports = {
  credentials: {
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    accessTokenKey: TWITTER_ACCESS_TOKEN,
    accessTokenSecret: TWITTER_ACCESS_SECRET
  }
};
