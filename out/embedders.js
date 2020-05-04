"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastText = require('../custom-modules/node-fasttext');
const fasttext_1 = require("./fasttext");
const bertpython_1 = require("./bertpython");
class Embedder {
    constructor(_type) {
        this._type = _type;
        if (_type === "fasttext") {
            this.embedder = new fasttext_1.Fasttext();
        }
        else if (_type === "use") {
            this.embedder = require('@tensorflow-models/universal-sentence-encoder');
        }
        else if (_type === "bert") {
            this.embedder = new bertpython_1.BertPython();
        }
        else {
            throw "You can only choose fasttext, use or bert for embedder";
        }
    }
    async ready() {
        if (this._type === "fasttext") {
            await this.embedder.getSentenceEmbedding("loading");
        }
        else if (this._type === "use") {
            this.embedder = await this.embedder.load();
        }
        else if (this._type === "bert") {
            await this.embedder.load();
        }
    }
    async getSentenceEmbedding(sentence) {
        if (this._type === "fasttext") {
            const emb = await this.embedder.getSentenceEmbedding(sentence);
            return emb;
        }
        if (this._type === "bert") {
            // console.log(sentence)
            const emb = await this.embedder.getSentenceEmbedding(sentence);
            // console.log(emb)
            return emb;
        }
        else if (this._type === "use") {
            const emb = await this.embedder.embed(sentence);
            const array_emb = Array.from(emb.dataSync());
            // console.log(array_emb)
            return array_emb;
        }
    }
}
exports.Embedder = Embedder;
// .then(model => {
//     // Embed an array of sentences.
//     const sentences = [
//         'Hello.',
//         'How are you?'
//     ];
//     model.embed(sentences).then(embeddings => {
//         // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
//         // So in this example `embeddings` has the shape [2, 512].
//         embeddings.print(true /* verbose */);
//     });
// });
//# sourceMappingURL=embedders.js.map