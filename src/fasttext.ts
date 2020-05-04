import { norm, divide, add, zeros, number, MathType } from 'mathjs'
var fastText = require('../custom-modules/node-fasttext');
const Promise = require('bluebird');

export class Fasttext {
    public ft: any;
    constructor() {
        this.ft = new fastText.Query("/home/pedro/git_clones/oos-eval/cc.en.300.bin");
    }

    async getWordEmbedding(mot: string): Promise<number[]> {
        const res = await this.ft.getWordVector(mot)
        const norme = norm(res);
        let divided_res: number[];
        if (norme > 0) {
            divided_res = divide(res, norme).valueOf() as number[];
        } else { divided_res = res; }
        return divided_res
    };

    async getSentenceEmbedding(phrase: string): Promise<number[]> {
        const mots = phrase.split(" ");
        const embedded: number[][] = await Promise.map(mots, (m: string) => this.getWordEmbedding(m), { concurrency: 10000 })
        const embed = embedded.reduce((sum: MathType, current: MathType) => add(sum, current), zeros(300));
        const embed_array = embed.valueOf() as number[]
        return embed_array
    }
}


// const embedded: Array<MathType> = [];
// for (const m of mots) {
//     const e = await this.getWordEmbedding(m);
//     console.log(e)
//     console.log(typeof e)
//     console.log("Prom", e instanceof Promise)
//     embedded.push(e);
// }