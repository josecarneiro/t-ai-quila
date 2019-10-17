"use strict";

const makeClient = require("./make-client");
const parseTweet = require("./parse-tweet");

module.exports = class TwitterStreamer {
  constructor(config) {
    this.config = config;
    this.client = makeClient(config.credentials);
    this.parseTweet = parseTweet;
  }

  listen(parameters, callback) {
    this.stream = this.client.stream("statuses/filter", parameters);

    this.stream.on("start", response => console.log("start"));
    // .on("end", response => console.log("end"));

    this.stream.on("data", tweet => callback(null, this.parseTweet(tweet)));
    this.stream.on("error", callback);
  }

  destroy() {
    // To stop the stream:
    // process.nextTick(() => stream.destroy()); // emits "end" and "error" events
    this.stream.destroy();
  }

  async search({ query, language, limit, priorTo }) {
    try {
      const values = await this.client.get("search/tweets", {
        q: query,
        ...(language && { lang: language }),
        ...(limit && { count: limit }),
        ...(priorTo && { until: priorTo.toISOString().replace(/T[^\s]+/, "") })
      });
      const { statuses, ...meta } = values;
      // console.log(meta);
      return statuses.map(this.parseTweet);
    } catch (error) {
      throw error;
    }
  }
};
