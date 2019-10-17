"use strict";

const fs = require("fs");

module.exports = (object, path) =>
  new Promise((resolve, reject) => {
    const data = JSON.stringify(object, null, 2);
    fs.writeFile(path, data, "utf8", error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
