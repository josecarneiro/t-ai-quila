"use strict";

const { MONGODB_URI } = process.env;
const ALLOWED_LANGUAGES = ["en"];
const TOPICS = [
  "tequila",
  "beer",
  "gin",
  "cider",
  "vodka",
  "bourbon",
  "wine",
  "rum",
  "cider",
  "whisky",
  "cocktail"
];

module.exports = {
  databaseURI: MONGODB_URI,
  allowedLanguages: ALLOWED_LANGUAGES,
  topics: TOPICS
};
