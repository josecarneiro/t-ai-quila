"use strict";

const TweetDocument = require("./models/tweet");
const AnalysisDocument = require("./models/analysis");

const FullDocument = require("./models/document");

module.exports = async () => {
  while (true) {
    const tweet = await TweetDocument.loadRandom();
    const exists = await FullDocument.findOne({ tweetId: tweet._id }).exec();
    if (!exists) {
      const analysis = await AnalysisDocument.makeAnalysis(tweet);
      // console.log(analysis);
      await FullDocument.makeOne({ tweet, analysis });
    }
  }
};
