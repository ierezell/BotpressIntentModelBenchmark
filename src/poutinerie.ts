
import { OptionsPoutine, DatasNum, Number2Intent, words } from "./types"
import { compute_acc, compute_acc_multi, compute_acc_greedy } from "./accuracy"
import { Svm_clf } from "./svm_clf"
import { Deep_clf } from "./deep_clf"
// import { Fasttext } from "./fasttext"
import { Embedder } from "./embedders"
const Promise = require('bluebird');
const Chalk = require('chalk');

export async function poutine(datas: DatasNum, options: OptionsPoutine, datas_multi: DatasNum, number2intent: Number2Intent) {
    //@ts-ignore
    // datas_multi = datas_multi.slice(-1)

    datas.sort(() => Math.random() - 0.5);
    // datas = datas.slice(0, 10)
    const train_datas = datas.slice(0, 0.8 * datas.length);
    const test_datas = datas.slice(0.8 * datas.length);
    // const train_datas = datas.slice(0, 1);
    // const test_datas = datas.slice(-1);
    console.log(`${train_datas.length} training data and ${test_datas.length} for test\n`)

    let embed: any;
    if (options.embed === "fasttext") { embed = new Embedder("fasttext"); }
    else if (options.embed === "use") { embed = new Embedder("use"); }
    await embed.ready();

    console.log(Chalk.cyan("Computing train embeddings\n"))
    const X: string[] = train_datas.map(sub_array => sub_array[0]);
    const y: number[] = train_datas.map(sub_array => sub_array[1][0]);
    const X_embed: number[][] = await Promise.map(X, (x: string) => embed.getSentenceEmbedding(x), { concurrency: 10000 })

    if (options.svm) { await poutine_model("svm", options, embed, X_embed, y, test_datas, datas_multi, number2intent) }
    if (options.deep) { await poutine_model("deep", options, embed, X_embed, y, test_datas, datas_multi, number2intent) }
}


async function poutine_model(name: string, options: OptionsPoutine, embed: any, X_train: number[][], y_train: number[], test: DatasNum, multi: DatasNum, number2intent: Number2Intent) {
    let model: any;
    if (name === "deep") {
        if (options.embed === "use") { model = new Deep_clf(embed, options.nb_int, 512) }
        if (options.embed === "fasttext") { model = new Deep_clf(embed, options.nb_int, 300) }
    }
    else if (name === "svm") { model = new Svm_clf(embed, options.nb_int); }
    else { throw "Model name need to be deep or svm"; }
    // if (options.load) { deep_classifier.load() }

    if (options.train) {
        console.log(`Training ${name}`)
        const start = Date.now();
        await model.train(X_train, y_train);
        const end = Date.now();
        console.log(`${name} trained in : ${(end - start) / 1000}s`);
    }

    if (options.acc) {
        console.log(Chalk.cyan(`Testing ${name} accuracy : `));
        const start_acc = Date.now();
        await compute_acc(test, model)
        const end_acc = Date.now();
        console.log(`\t\tAccuracy ${name} in : ${(end_acc - start_acc) / 1000}s`);
    }

    if (options.acc_multi) {
        console.log(Chalk.cyan(`Testing ${name} multi accuracy : `));
        const start_acc_multi = Date.now();
        //@ts-ignore
        await compute_acc_multi(multi, model, number2intent)
        const end_acc_multi = Date.now();
        console.log(`\t\tAccuracy Multi ${name} in : ${(end_acc_multi - start_acc_multi) / 1000}s`);
    }

    if (options.acc_greedy) {
        console.log(Chalk.cyan(`Testing ${name} greedy accuracy : `));
        const start_acc_greedy = Date.now();
        //@ts-ignore
        await compute_acc_greedy(multi, model, number2intent)
        const end_acc_greedy = Date.now();
        console.log(`\t\tAccuracy greedy ${name} in : ${(end_acc_greedy - start_acc_greedy) / 1000}s\n\n`);
    }
}
