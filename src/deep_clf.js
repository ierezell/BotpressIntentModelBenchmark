// import * as tf from '@tensorflow/tfjs';
// // Load the binding
// import '@tensorflow/tfjs-node';
// export class Deep_clf {
//     clf;
//     constructor(nb_intent: number) {
//         this.clf = tf.sequential();
//         this.clf.add(tf.layers.dense({ units: 150, activation: 'relu', inputShape: [300] }));
//         this.clf.add(tf.layers.dropout({ rate: 0.2 }));
//         this.clf.add(tf.layers.dense({ units: 150, activation: 'relu' }));
//         this.clf.add(tf.layers.dense({ units: nb_intent, activation: 'softmax' }));
//         this.clf.compile({
//             optimizer: tf.train.adam(),
//             loss: 'sparseCategoricalCrossentropy',
//             metrics: ['accuracy']
//         });
//     }
//     train(datas: Array<Array<number>>) {
//         this.clf.train(datas);
//     }
//     predict(data: Array<Array<number>>) {
//         return this.clf.predictProbabilitiesSync(data);
//     }
// }
