
import { OptionsPoutine, DatasNum, Number2Intent, words } from "./types"
import { compute_acc, compute_acc_multi, compute_acc_greedy } from "./accuracy"
import { Svm_clf } from "./svm_clf"
import { Deep_clf } from "./deep_clf"
import { Fasttext } from "./fasttext"
const Promise = require('bluebird');

export async function poutine(datas: DatasNum, options: OptionsPoutine, datas_multi?: DatasNum, number2intent?: Number2Intent, ) {
    //@ts-ignore
    datas_multi = datas_multi.slice(-1)

    datas.sort(() => Math.random() - 0.5);
    // datas = datas.slice(0, 10)
    // const train_datas = datas.slice(0, 0.8 * datas.length);
    // const test_datas = datas.slice(0.8 * datas.length);
    const train_datas = datas.slice(0, datas.length - 1);
    const test_datas = datas.slice(datas.length - 1);
    console.log(train_datas.length, "training data and", test_datas.length, "for test")

    const ft = new Fasttext();

    console.log("Computing train embeddings")
    const X: string[] = train_datas.map(sub_array => sub_array[0]);
    const y: number[] = train_datas.map(sub_array => sub_array[1][0])
    const X_embed: number[][] = await Promise.map(X, (x: string) => ft.getSentenceEmbedding(x), { concurrency: 10000 })


    if (options.svm) {
        const svm_classifier = new Svm_clf(ft);
        // if (options.load) { svm_classifier.load() }

        if (options.train) { await svm_classifier.train(X_embed, y) }

        // if (options.save) { svm_classifier.save() }

        console.log('Testing Svm accuracy : ');
        const start_acc_svm = Date.now();
        if (options.acc) { await compute_acc(test_datas, svm_classifier) }
        const end_acc_svm = Date.now();
        console.log('Accuracy Svm in : ', (end_acc_svm - start_acc_svm) / 1000, "s");

        console.log('Testing Svm multi accuracy : ');
        const start_acc_multi_svm = Date.now();
        // @ts-ignore
        if (options.acc_multi) { await compute_acc_multi(datas_multi.concat(test_datas), svm_classifier, number2intent) }

        const end_acc_multi_svm = Date.now();
        console.log('Accuracy Multi Svm in : ', (end_acc_multi_svm - start_acc_multi_svm) / 1000, "s");
        console.log("\n\n\n\n")
    }

    if (options.deep) {
        const deep_classifier = new Deep_clf(ft, 150);
        // if (options.load) { deep_classifier.load() }

        if (options.train) { await deep_classifier.train(X_embed, y) }

        // if (options.save) { deep_classifier.save() }
        console.log('Testing Deep accuracy : ');
        const start_acc_deep = Date.now();
        if (options.acc) { await compute_acc(test_datas, deep_classifier) }
        const end_acc_deep = Date.now();
        console.log('Accuracy Deep in : ', (end_acc_deep - start_acc_deep) / 1000, "s");


        console.log('Testing Deep multi accuracy : ');
        const start_acc_multi_deep = Date.now();
        //@ts-ignore
        if (options.acc_multi) { await compute_acc_multi(datas_multi, deep_classifier, number2intent) }
        const end_acc_multi_deep = Date.now();
        console.log('Accuracy Multi Deep in : ', (end_acc_multi_deep - start_acc_multi_deep) / 1000, "s");


        const start_acc_greedy_deep = Date.now();
        if (options.acc_greedy) { await compute_acc_greedy(datas_multi, deep_classifier) }
        const end_acc_greedy_deep = Date.now();
        console.log('Accuracy greedy Deep in : ', (end_acc_greedy_deep - start_acc_greedy_deep) / 1000, "s");
    }
}
