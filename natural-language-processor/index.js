"use strict";

const language = require("@google-cloud/language");

module.exports = class LanguageProcessor {
  constructor(credentials) {
    this.client = new language.LanguageServiceClient({ credentials });
  }

  _makeDocument(text) {
    return {
      content: text,
      type: "PLAIN_TEXT"
    };
  }

  async analyzeSentimentOfText(text) {
    const document = this._makeDocument(text);
    const [result] = await this.client.analyzeSentiment({ document });
    return result;
  }

  async analyzeEntitySentimentOfText(text) {
    const document = this._makeDocument(text);
    const [result] = await this.client.analyzeEntitySentiment({ document });
    return result;
  }

  async completeAnalysis(text) {
    const results = await Promise.all([
      this.analyzeSentimentOfText(text),
      this.analyzeEntitySentimentOfText(text)
    ]);
    return {
      documentSentiment: results[0],
      entitySentiment: results[1]
    };
  }
};
