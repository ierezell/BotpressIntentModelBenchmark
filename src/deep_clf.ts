// import * as tf from '@tensorflow/tfjs';
// Load the binding
import * as tf from '@tensorflow/tfjs-node';
import { DatasNum, ProbDict } from "./types";

const Promise = require('bluebird');

export class Deep_clf {
    private _clf: any;
    constructor(private _embedder: any, private _nb_intent: number, private _embed_size: number) {
        this._clf = tf.sequential();

        this._clf.add(tf.layers.inputLayer({ inputShape: [_embed_size] }));
        this._clf.add(tf.layers.dense({ units: Math.floor((_embed_size + _nb_intent) / 2), useBias: true }));
        this._clf.add(tf.layers.reLU());
        this._clf.add(tf.layers.dropout({ rate: 0.2 }));
        this._clf.add(tf.layers.batchNormalization());
        this._clf.add(tf.layers.dense({ units: Math.floor((_embed_size + _nb_intent) / 2), useBias: true }));
        this._clf.add(tf.layers.reLU());
        this._clf.add(tf.layers.dropout({ rate: 0.2 }));
        this._clf.add(tf.layers.batchNormalization());
        this._clf.add(tf.layers.dense({ units: _nb_intent, useBias: true }));
        this._clf.add(tf.layers.softmax())

        this._clf.compile({
            optimizer: tf.train.adam(0.001),
            loss: tf.losses.softmaxCrossEntropy,
            metrics: ['accuracy']
        });
        // console.log(this._clf.summary())
    }
    async train(X: number[][], y: number[]): Promise<void> {
        await this._clf.fit(tf.tensor2d(X), tf.oneHot(tf.tensor1d(y, 'int32'), this._nb_intent), {
            batchSize: 512,
            epochs: 500,
            // validationSplit: 0.1,
            verbose: 0,
            shuffle: true,
            // callbacks: tf.callbacks.earlyStopping({ monitor: 'val_acc' })
            callbacks: tf.callbacks.earlyStopping({ monitor: 'loss' })
        });
    }
    async predict(sentence: string): Promise<[number, number]> {
        const embed: number[] = await this._embedder.getSentenceEmbedding(sentence);
        const tens: tf.Tensor = tf.tensor1d(embed).reshape([1, this._embed_size]);
        const probs: tf.Tensor = this._clf.predict(tens).reshape([this._nb_intent]);
        const pred: tf.Tensor = tf.argMax(probs)
        // pred.print()
        const proba: tf.Tensor = tf.max(probs)
        // proba.print()
        // console.log(pred, proba)
        return [pred.dataSync()[0], proba.dataSync()[0]]
    }

    save(path: string) {
        this._clf.save(path)
    }
    load(path: string) {
        this._clf.load(path)
    }
}
