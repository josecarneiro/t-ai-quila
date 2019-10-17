"use strict";

const urlRegExp = /https?:\/\/[^\s]+/g;
const usernameRegExp = /@[^\s]+/g;
const hashTagRegExp = /#[^\s]+/g;

const parseText = text =>
  text
    .replace(urlRegExp, "")
    .replace(usernameRegExp, " ")
    .replace(hashTagRegExp, " ")
    .replace(/RT /g, "")
    .replace(/\n/g, " ")
    .replace(/ +/g, " ")
    .trim();

module.exports = tweet => {
  const data = {
    data: tweet
  };
  {
    const {
      id,
      name,
      screen_name: username,
      location,
      verified,
      followers_count: followers,
      friends_count: following,
      statuses_count: statuses,
      utc_offset: offset
    } = tweet.user;
    data.user = {
      id,
      name,
      username,
      location,
      verified,
      followers,
      following,
      statuses,
      offset
    };
  }
  {
    const {
      id,
      timestamp_ms: timestamp,
      created_at: publicationDate,
      text,
      lang: language
    } = tweet;
    Object.assign(data, {
      id: id.toString(),
      publicationDate: new Date(publicationDate),
      text,
      parsed: parseText(text),
      language
    });
  }
  return data;
};
