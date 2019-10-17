"use strict";

const mongoose = require("mongoose");

const schema = {
  _id: {
    type: String,
    toString: true
  },
  publicationDate: {
    type: Date,
    required: true
  },
  parsed: {
    type: String
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  }
};

const TweetDocument = new mongoose.Schema(schema, {
  timestamps: { createdAt: "createdDate", updatedAt: "updateDate" }
});

const makeMultiple = async function(tweets) {
  const Model = this;
  const documents = [];
  for (let { id, ...tweet } of tweets) {
    const existent = await Model.findById(id);
    if (existent) {
      documents.push(existent);
    } else {
      const document = await Model.create({
        _id: id,
        ...tweet
      });
      documents.push(document);
    }
  }
  return documents;
};

const loadRandom = async function(query) {
  const Model = this;
  const count = await Model.countDocuments();
  if (count) {
    const index = Math.floor(Math.random() * count);
    const [document] = await Model.find(query)
      .skip(index)
      .limit(1)
      .exec();
    return document;
  }
};

Object.assign(TweetDocument.statics, { makeMultiple, loadRandom });

module.exports = mongoose.model("TweetDocument", TweetDocument);
