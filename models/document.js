"use strict";

const mongoose = require("mongoose");

const schema = {
  tweetId: {
    type: String,
    required: true
  },
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tweet: mongoose.Schema.Types.Mixed,
  analysis: mongoose.Schema.Types.Mixed
};

const FullDocument = new mongoose.Schema(schema, {
  timestamps: { createdAt: "createdDate", updatedAt: "updateDate" }
});

const makeOne = async function({ tweet, analysis }) {
  return this.create({
    tweetId: tweet._id,
    analysisId: analysis._id,
    tweet: tweet.toObject(),
    analysis: analysis.toObject()
  });
};

const copyObject = object => JSON.parse(JSON.stringify(object));

const makeFullReport = async function({ entities: allowedEntities }) {
  const Model = this;
  const documents = await Model.find()
    .select("analysis.entities analysis.overallSentiment tweet.publicationDate")
    // .limit(10)
    .sort({ createdDate: -1 })
    .exec();
  // console.log(documents);
  const report = documents
    .map(
      ({
        tweet: { publicationDate: date } = {},
        analysis: { entities = [], overallSentiment } = {}
      }) => ({
        date,
        entities,
        overallSentiment
      })
    )
    .reduce((accumulator, value, index, array) => {
      const accumulatorCopy = copyObject(accumulator);
      for (let { value: name, ...entity } of value.entities) {
        const allowedEntity = allowedEntities.find(val => name.toLowerCase().includes(val));
        if (allowedEntity) {
          const moment =
            (value.date instanceof Date ? value.date.toISOString() : value.date).split(":")[0] +
            ":00:00.000Z";
          if (!accumulatorCopy[allowedEntity]) accumulatorCopy[allowedEntity] = {};
          if (!accumulatorCopy[allowedEntity][moment]) accumulatorCopy[allowedEntity][moment] = [];
          const overallSentiment =
            entity.salience * entity.sentiment.magnitude * entity.sentiment.score;
          // accumulatorCopy[allowedEntity][moment].push({
          //   salience: entity.salience,
          //   sentiment: entity.sentiment,
          //   overall: overallSentiment
          // });
          accumulatorCopy[allowedEntity][moment].push(overallSentiment);
        }
      }
      return accumulatorCopy;
    }, {});
  return report;
};

Object.assign(FullDocument.statics, { makeOne, makeFullReport });

module.exports = mongoose.model("FullDocument", FullDocument);
