// import * as tf from '@tensorflow/tfjs';
// Load the binding
import * as tf from '@tensorflow/tfjs-node';
export class Deep_clf {
    constructor(nb_intent) {
        this.clf = tf.sequential();
        this.clf.add(tf.layers.dense({ units: 150, activation: 'relu', inputShape: [300] }));
        this.clf.add(tf.layers.dropout({ rate: 0.2 }));
        this.clf.add(tf.layers.dense({ units: 150, activation: 'relu' }));
        this.clf.add(tf.layers.dense({ units: nb_intent, activation: 'softmax' }));
        this.clf.compile({
            optimizer: tf.train.adam(),
            loss: 'sparseCategoricalCrossentropy',
            metrics: ['accuracy']
        });
    }
    train(datas) {
        this.clf.train(datas);
    }
    predict(data) {
        return this.clf.predictProbabilitiesSync(data);
    }
}
//# sourceMappingURL=deep_clf.js.map