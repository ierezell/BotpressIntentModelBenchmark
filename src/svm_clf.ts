import { DatasNum, ProbDict } from "./types";
import { Fasttext } from "./fasttext"
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

    async predict(sentence: string): Promise<[number, number]> {
        const embed: number[] = await this.embedder.getSentenceEmbedding(sentence);
        const pred_probs = await this.clf.predict_probability(embed);
        const pred: number = pred_probs.prediction
        const probs: number[] = pred_probs.probabilities
        const max: number = Math.max(...probs);
        return [pred, max]
    }

    save(path: string) {
        this.clf.save(path)
    }
    load(path: string) {
        this.clf.load(path)
    }
}
