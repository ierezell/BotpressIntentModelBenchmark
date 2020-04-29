// import * as tf from '@tensorflow/tfjs';
// Load the binding
import * as tf from '@tensorflow/tfjs-node';
import { DatasNum, ProbDict } from "./types";

const Promise = require('bluebird');

export class Deep_clf {
    public clf: any;
    private embedder: any;
    constructor(ft: any, nb_intent: number) {
        this.embedder = ft;
        this.clf = tf.sequential();

        this.clf.add(tf.layers.inputLayer({ inputShape: [300] }));
        this.clf.add(tf.layers.dense({ units: 150, useBias: true }));
        this.clf.add(tf.layers.reLU());
        this.clf.add(tf.layers.dropout({ rate: 0.2 }));
        this.clf.add(tf.layers.batchNormalization());
        this.clf.add(tf.layers.dense({ units: nb_intent, useBias: true }));
        this.clf.add(tf.layers.softmax())

        this.clf.compile({
            optimizer: tf.train.adam(0.001),
            loss: tf.losses.softmaxCrossEntropy,
            metrics: ['accuracy']
        });
        // console.log(this.clf.summary())
    }
    async train(X: number[][], y: number[]): Promise<void> {
        console.log("Training Deep")
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
        })
        const end_deep = Date.now();
        console.log('Deep trained in : ', (end_deep - start_deep) / 1000, "s");
    }
    async predict(sentence: string): Promise<[number, number]> {
        const embed: number[] = await this.embedder.getSentenceEmbedding(sentence);
        const tens: tf.Tensor = tf.tensor1d(embed).reshape([1, 300]);
        const probs: tf.Tensor = this.clf.predict(tens).reshape([150]);
        const pred: tf.Tensor = tf.argMax(probs)
        // pred.print()
        const proba: tf.Tensor = tf.max(probs)
        // proba.print()
        // console.log(pred, proba)
        return [pred.dataSync()[0], proba.dataSync()[0]]
    }

    save(path: string) {
        this.clf.save(path)
    }
    load(path: string) {
        this.clf.load(path)
    }
}
