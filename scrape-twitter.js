"use strict";

const TweetDocument = require("./models/tweet");
const TwitterStreamer = require("./twitter");

const { allowedLanguages, topics } = require("./config");
const twitterConfig = require("./config/twitter");

const twitterStreamer = new TwitterStreamer(twitterConfig);

const loadTweets = async ({ topics, priorTo }) =>
  twitterStreamer.search({
    query: topics.join(" OR "),
    language: "en",
    limit: 100,
    priorTo
  });

const generateDate = days => new Date(new Date() - Math.random() * 1000 * 60 * 60 * 24 * days);

const tweetIsValid = tweet => allowedLanguages.includes(tweet.language);

module.exports = async () => {
  while (true) {
    const tweets = await loadTweets({
      // priorTo: generateDate(7)
      topics
    });
    await TweetDocument.makeMultiple(tweets.filter(tweetIsValid));
  }
};
