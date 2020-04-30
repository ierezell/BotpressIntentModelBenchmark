"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svm = require('../custom-modules/node-svm2');
const Promise = require('bluebird');
class Svm_clf {
    constructor(emb) {
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
            weight_label: Array(5).fill(0),
            weight: Array(5).fill(0.0),
            nu: 0.5,
            p: 0.0,
            shrinking: 1,
            probability: 0,
            mute: 1 // homemade parameter, ignored by libsvm
        };
    }
    async train(X, y) {
        console.log("Training SVM");
        const start_svm = Date.now();
        // console.log(X)
        // console.log(y)
        this.clf.train(this.params, X, y);
        const end_svm = Date.now();
        console.log('SVM trained in : ', (end_svm - start_svm) / 1000, "s");
    }
    async predict(sentence) {
        const embed = await this.embedder.getSentenceEmbedding(sentence);
        const pred_probs = await this.clf.predict_probability(embed);
        const pred = pred_probs.prediction;
        const probs = pred_probs.probabilities;
        const max = Math.max(...probs);
        return [pred, max];
    }
    save(path) {
        this.clf.save(path);
    }
    load(path) {
        this.clf.load(path);
    }
}
exports.Svm_clf = Svm_clf;
//# sourceMappingURL=svm_clf.js.map