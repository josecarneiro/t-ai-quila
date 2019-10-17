"use strict";

const mongoose = require("mongoose");

const AnalysisDocument = new mongoose.Schema(
  {
    tweetId: {
      type: String,
      required: true
    },
    data: mongoose.Schema.Types.Mixed,
    overallSentiment: {
      score: Number,
      magnitude: Number
    },
    entities: [
      {
        value: String,
        salience: Number,
        sentiment: {
          score: Number,
          magnitude: Number
        }
      }
    ]
  },
  {
    timestamps: { createdAt: "createdDate", updatedAt: "updateDate" }
  }
);

const LanguageProcessor = require("./../natural-language-processor");

const languageProcessorConfig = require("./../config/language-processor");

const languageProcessor = new LanguageProcessor(languageProcessorConfig);

const writeFile = require("./../write-file");

(async () => {
  const text =
    "At BOLD by Devoteam, we are focused on developing and delivering innovative technological solutions through a unique combination of technology expertise, agility, creativity and design. Founded in Portugal in 2009, BOLD by Devoteam has offices in Aveiro, Lisbon and Porto, and a vast national and international experience, represented by our +700 employees. Since 2018, BOLD by Devoteam is part of the Devoteam Group, a global leading player in Digital Transformation for leading organisations across EMEA, with a revenue of €650M. Together, we share a common vision of transforming technology to create value for our clients, partners and employees in a world where technology is developed for people.";
  const data = await languageProcessor.completeAnalysis(text);
  console.log(data);
  await writeFile(data, "BOLD.json");
})();

const makeAnalysis = async function(tweet) {
  const Model = this;
  const existent = await Model.findOne({ tweetId: tweet._id }).exec();
  if (existent) return existent;
  const text = tweet.parsed || (tweet.data && tweet.data.text) || "";
  const data = await languageProcessor.completeAnalysis(text);
  const document = await Model.create({ tweetId: tweet._id, data });
  await document.makeReport();
  return document;
};

const makeReport = async function() {
  const document = this;
  const data = document.data;
  const {
    entitySentiment: { entities = [] } = {},
    documentSentiment: { documentSentiment: overallSentiment } = {}
  } = document.data;
  document.entities = entities.map(({ name: value, salience, sentiment }) => ({
    value,
    salience,
    sentiment
  }));
  document.overallSentiment = overallSentiment;
  // console.log(overallSentiment);
  await document.save();
};

Object.assign(AnalysisDocument.statics, { makeAnalysis });
Object.assign(AnalysisDocument.methods, { makeReport });

module.exports = mongoose.model("AnalysisDocument", AnalysisDocument);
