"use strict";

require("dotenv").config();

const config = require("./config");

const database = require("./tools/database");

const scrapeTwitter = require("./scrape-twitter");
const analyzeTweets = require("./analyze-tweets");

(async () => {
  try {
    await database.connect(config.databaseURI);
    console.log(`Database connected to URI "${config.databaseURI}"`);
  } catch (error) {
    console.log(`There was an error connecting the database to URI "${config.databaseURI}"`, error);
    throw error;
  }
  try {
    await Promise.all([
      // ...
      // scrapeTwitter(),
      analyzeTweets()
    ]);
  } catch (error) {
    console.log(`There was an error scraping or analyzing`, error);
    throw error;
  }
})();
