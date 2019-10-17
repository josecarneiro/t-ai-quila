"use strict";

require("dotenv").config();

const config = require("./config");

const database = require("./tools/database");

const FullDocument = require("./models/document");

const { topics } = require("./config");

const writeFile = require("./write-file");

(async () => {
  try {
    await database.connect(config.databaseURI);
    console.log(`Database connected to URI "${config.databaseURI}"`);
  } catch (error) {
    console.log(`There was an error connecting the database to URI "${config.databaseURI}"`, error);
    throw error;
  }
  try {
    const report = await FullDocument.makeFullReport({ entities: topics });
    await writeFile(report, "output.json");
  } catch (error) {
    console.log("Error making report");
    console.log(error);
  }
})();
