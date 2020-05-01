import { DatasNum, ProbDict } from "./types";
import { Fasttext } from "./fasttext"
import { NumericDictionary } from "lodash";
var svm = require('../custom-modules/node-svm2');
const Promise = require('bluebird');

export class Svm_clf {
    public clf: any;
    private embedder: any;
    private params: any;
    constructor(emb: any, nb_int: number) {
        this.embedder = emb;
        this.clf = new svm.NSVM();
        this.params = {
            svm_type: 0,
            kernel_type: 0,
            degree: 3,
            gamma: 0.5,
            coef0: 0.0,
            cache_size: 150,
            eps: 0.1,
            C: 1.0,
            nr_weight: 0,
            weight_label: Array(nb_int).fill(0),
            weight: Array(nb_int).fill(0.0),
            nu: 0.5,
            p: 0.0,
            shrinking: 1, // not default
            probability: 0,
            mute: 1 // homemade parameter, ignored by libsvm
        };

    }
    async train(X: number[][], y: number[]): Promise<void> {
        this.clf.train(this.params, X, y);
    }

    async predict(sentence: string): Promise<[number, number, number[][]]> {
        const embed: number[] = await this.embedder.getSentenceEmbedding(sentence);
        const pred_probs = await this.clf.predict_probability(embed);
        let max_1 = 0;
        let max_2 = 0;
        let max_3 = 0;
        let idx_1 = 0;
        let idx_2 = 0;
        let idx_3 = 0;
        for (let i = 0; i < pred_probs.length; i++) {
            if (pred_probs[i] > max_1) { max_1 = pred_probs[i]; idx_1 = i }
            if (pred_probs[i] > max_2 && pred_probs[i] < max_1) { max_2 = pred_probs[i]; idx_2 = i }
            if (pred_probs[i] > max_3 && pred_probs[i] < max_1 && pred_probs[i] < max_2) { max_3 = pred_probs[i]; idx_3 = i }
        }
        const top_k: number[][] = [idx_1, idx_2, idx_3].map((e, i) => [e, [max_1, max_2, max_3][i]])
        const pred: number = pred_probs.prediction
        const probs: number[] = pred_probs.probabilities
        const max: number = Math.max(...probs);
        return [pred, max, top_k]
    }

    save(path: string) {
        this.clf.save(path)
    }
    load(path: string) {
        this.clf.load(path)
    }
}
