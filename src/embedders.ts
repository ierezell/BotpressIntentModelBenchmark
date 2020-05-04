var fastText = require('../custom-modules/node-fasttext');

import { Fasttext } from "./fasttext";
import { BertPython } from "./bertpython";


export class Embedder {
    embedder: any;
    constructor(private _type: string) {
        if (_type === "fasttext") { this.embedder = new Fasttext(); }
        else if (_type === "use") { this.embedder = require('@tensorflow-models/universal-sentence-encoder'); }
        else if (_type === "bert") { this.embedder = new BertPython() }
        else { throw "You can only choose fasttext, use or bert for embedder"; }
    }

    async ready() {
        if (this._type === "fasttext") { await this.embedder.getSentenceEmbedding("loading"); }
        else if (this._type === "use") { this.embedder = await this.embedder.load(); }
        else if (this._type === "bert") { await this.embedder.load(); }
    }

    async getSentenceEmbedding(sentence: string) {
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
            return array_emb
        }
    }
}

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