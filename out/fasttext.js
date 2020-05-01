"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs_1 = require("mathjs");
var fastText = require('../custom-modules/node-fasttext');
const Promise = require('bluebird');
class Fasttext {
    constructor() {
        this.ft = new fastText.Query("/home/pedro/git_clones/oos-eval/cc.fr.300.bin");
    }
    async getWordEmbedding(mot) {
        const res = await this.ft.getWordVector(mot);
        const norme = mathjs_1.norm(res);
        let divided_res;
        if (norme > 0) {
            divided_res = mathjs_1.divide(res, norme).valueOf();
        }
        else {
            divided_res = res;
        }
        return divided_res;
    }
    ;
    async getSentenceEmbedding(phrase) {
        const mots = phrase.split(" ");
        const embedded = await Promise.map(mots, (m) => this.getWordEmbedding(m), { concurrency: 10000 });
        const embed = embedded.reduce((sum, current) => mathjs_1.add(sum, current), mathjs_1.zeros(300));
        const embed_array = embed.valueOf();
        return embed_array;
    }
}
exports.Fasttext = Fasttext;
// const embedded: Array<MathType> = [];
// for (const m of mots) {
//     const e = await this.getWordEmbedding(m);
//     console.log(e)
//     console.log(typeof e)
//     console.log("Prom", e instanceof Promise)
//     embedded.push(e);
// }
//# sourceMappingURL=fasttext.js.map