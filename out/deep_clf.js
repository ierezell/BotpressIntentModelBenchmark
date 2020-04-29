"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as tf from '@tensorflow/tfjs';
// Load the binding
const tf = require("@tensorflow/tfjs-node");
const Promise = require('bluebird');
class Deep_clf {
    constructor(ft, nb_intent) {
        this.embedder = ft;
        this.clf = tf.sequential();
        this.clf.add(tf.layers.inputLayer({ inputShape: [300] }));
        this.clf.add(tf.layers.dense({ units: 150, useBias: true }));
        this.clf.add(tf.layers.reLU());
        this.clf.add(tf.layers.dropout({ rate: 0.2 }));
        this.clf.add(tf.layers.batchNormalization());
        this.clf.add(tf.layers.dense({ units: nb_intent, useBias: true }));
        this.clf.add(tf.layers.softmax());
        this.clf.compile({
            optimizer: tf.train.adam(0.001),
            loss: tf.losses.softmaxCrossEntropy,
            metrics: ['accuracy']
        });
        // console.log(this.clf.summary())
    }
    async train(X, y) {
        console.log("Training Deep");
        const start_deep = Date.now();
        await this.clf.fit(tf.tensor2d(X), tf.oneHot(tf.tensor1d(y, 'int32'), 150), {
            batchSize: 512,
            epochs: 30,
            // validationSplit: 0.2,
            verbose: 0,
            shuffle: true
            // callbacks: {
            //     onEpochEnd: (epoch: any, logs: any) => {
            //         console.log(`epoch ${epoch}, loss ${logs.loss}, val_loss ${logs.val_loss}, acc ${logs.acc}, val_acc ${logs.val_acc}`)
            //     }
            // }
        });
        const end_deep = Date.now();
        console.log('Deep trained in : ', (end_deep - start_deep) / 1000, "s");
    }
    async predict(sentence) {
        const embed = await this.embedder.getSentenceEmbedding(sentence);
        const tens = tf.tensor1d(embed).reshape([1, 300]);
        const probs = this.clf.predict(tens).reshape([150]);
        const pred = tf.argMax(probs);
        // pred.print()
        const proba = tf.max(probs);
        // proba.print()
        // console.log(pred, proba)
        return [pred.dataSync()[0], proba.dataSync()[0]];
    }
    save(path) {
        this.clf.save(path);
    }
    load(path) {
        this.clf.load(path);
    }
}
exports.Deep_clf = Deep_clf;
//# sourceMappingURL=deep_clf.js.map