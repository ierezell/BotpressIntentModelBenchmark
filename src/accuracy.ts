
import { DatasNum, ProbDict, Number2Intent } from "./types";
import { isEqual, some, intersection } from 'lodash'
const Promise = require('bluebird');
const Chalk = require('chalk');

export async function compute_acc(datas: DatasNum, model: any) {
    const X: string[] = datas.map(sub_array => sub_array[0]);
    const y: number[] = datas.map(sub_array => sub_array[1][0]);
    const res: [number, number, number[][]][] = await Promise.map(X, (x: number[]) => model.predict(x), { concurrency: 10000 })
    let score_f1: number = 0;
    let score_f3: number = 0;
    res.forEach(([pred,], index) => { if (pred === y[index]) { score_f1 += 1 } })
    // res.forEach(([, , top_k], index) => { console.log(top_k.map(e => e[0]), index) })

    res.forEach(([, , top_k], index) => { if (some(intersection(top_k.map(e => e[0]), [y[index]]))) { score_f3 += 1 } })
    console.log(`\tScore F1 : ${(score_f1 / y.length) * 100}%  <= (${score_f1}/${y.length})`);
    console.log(`\tScore F3 : ${(score_f3 / y.length) * 100}%  <= (${score_f3}/${y.length})`);
}


export async function compute_acc_multi(datas: DatasNum, model: any, number2intent: Number2Intent) {

    const X: string[] = datas.map(sub_array => sub_array[0]);
    const y: number[][] = datas.map(sub_array => sub_array[1]);

    const res: number[][] = await Promise.map(X, (x: string) => predict_multi(model, x, number2intent, false), { concurrency: 10000 })
    let score: number = 0;
    let score_loose: number = 0;
    // console.log("RES", res)
    // console.log("Y", y)
    res.forEach((pred, index) => {
        if (isEqual(pred, y[index])) {
            // console.log(_.isEqual(pred, y[index]), pred, y[index]); 
            score += 1
        }
        if (some(intersection(pred, y[index]))) {
            //console.log(_.some(_.intersection(pred, y[index])), pred, y[index]); 
            score_loose += 1
        }
    })
    console.log(`\tScore multi : ${(score / y.length) * 100}%  <= (${score}/${y.length})`);
    console.log(`\tScore multi loose: ${(score_loose / y.length) * 100}%  <= (${score_loose}/${y.length})`);

}


export async function compute_acc_greedy(datas: DatasNum, model: any, number2intent: Number2Intent) {
    const X: string[] = datas.map(sub_array => sub_array[0]);
    const y: number[][] = datas.map(sub_array => sub_array[1]);

    const res: number[][] = await Promise.map(X, (x: string) => predict_greedy(model, x, number2intent, false), { concurrency: 1000 })
    let score: number = 0;
    let score_loose: number = 0;
    // console.log("RES")
    // res.forEach((pred) => console.log(pred.map(e => number2intent[e])))
    // console.log("REAL")
    // y.forEach((pred) => console.log(pred.map(e => number2intent[e])))
    // console.log("RES", res)
    // console.log("Y", y)
    res.forEach((pred, index) => {
        if (isEqual(pred, y[index])) {
            //console.log(_.isEqual(pred, y[index]), pred, y[index]); 
            score += 1
        }
        if (some(intersection(pred, y[index]))) {
            //console.log(_.some(_.intersection(pred, y[index])), pred, y[index]);
            score_loose += 1
        }
    })
    console.log(`\tScore greedy : ${(score / y.length) * 100}%  <= (${score}/${y.length})`);
    console.log(`\tScore greedy loose : ${(score_loose / y.length) * 100}%  <= (${score_loose}/${y.length})`);
}

async function predict_multi(model: any, phrase: string, number2intent: Number2Intent, verbose: boolean): Promise<number[]> {
    if (verbose) { console.log("Phrase : ", phrase); }
    const probas_gauche: ProbDict = {};
    const probas_droite: ProbDict = {};
    const mots: string[] = phrase.split(" ")
    for (let i = (-mots.length / 5); i < (mots.length / 5); i++) {
        let gauche: string[] = mots.slice(0, (mots.length / 2) + i + 1);
        let droite: string[] = mots.slice((mots.length / 2) + i + 1);

        let [intent_gauche, prob_gauche, top_k]: [number, number, number[][]] = await model.predict(gauche.join(" "));
        let [intent_droite, prob_droite, top_k]: [number, number, number[][]] = await model.predict(droite.join(" "));

        if (!probas_gauche[intent_gauche]) { probas_gauche[intent_gauche] = [] }
        if (!probas_droite[intent_droite]) { probas_droite[intent_droite] = [] }

        probas_gauche[intent_gauche].push(prob_gauche)
        probas_droite[intent_droite].push(prob_droite)

        if (verbose) {
            console.log("gauche : ", gauche, "\n", number2intent[intent_gauche], prob_gauche);
            console.log("droite : ", droite, "\n", number2intent[intent_droite], prob_droite);
        }
    }
    const [intent_all, prob_all, top_k]: [number, number, number[][]] = await model.predict(phrase)

    if (verbose) { console.log("All", prob_all, number2intent[intent_all]) }

    if (!probas_gauche[intent_all]) { probas_gauche[intent_all] = []; }
    if (!probas_droite[intent_all]) { probas_droite[intent_all] = []; }
    probas_gauche[intent_all].push(prob_all)
    probas_droite[intent_all].push(prob_all)

    let mean_gauche: any = {};
    let mean_droite: any = {};
    Object.entries(probas_gauche).forEach(([key, value]) => {
        mean_gauche[key] = value.reduce((curr, elt) => curr + elt, 0)
        mean_gauche[key] /= value.length
    });
    Object.entries(probas_droite).forEach(([key, value]) => {
        mean_droite[key] = value.reduce((curr, elt) => curr + elt, 0)
        mean_droite[key] /= value.length
    });

    if (verbose) { console.log("\nMeans : \n", mean_droite, "\n", mean_gauche) }
    const max_gauche = Object.keys(mean_gauche).reduce((a, b) => mean_gauche[a] > mean_gauche[b] ? a : b);
    const max_droite = Object.keys(mean_gauche).reduce((a, b) => mean_gauche[a] > mean_gauche[b] ? a : b);
    if (verbose) { console.log("Max gauche", max_gauche, "Max droite", max_droite) }

    const intentions: number[] = [];
    if (mean_gauche[max_gauche] > 0.5) { intentions.push(Number(max_gauche)); delete mean_droite[max_gauche] }
    if (mean_droite[max_droite] > 0.5) { intentions.push(Number(max_droite)) }
    if (!intentions.length) { intentions.push(intent_all) }

    return intentions
}


async function predict_greedy(model: any, phrase: string, number2intent: Number2Intent, verbose: boolean): Promise<number[]> {
    if (verbose) { console.log("Phrase : ", phrase); }
    let prob_max = 0;
    let ind_cut = 0
    const intents: number[] = [];
    const mots = phrase.split(" ");
    for (let i = 1; i <= (mots.length); i++) {
        let cutted_mots: string[] = mots.slice(ind_cut, i);
        if (verbose) { console.log(cutted_mots) }

        let [intent, prob, top_k]: [number, number, number[][]] = await model.predict(cutted_mots.join(" "));
        if (verbose) { console.log(number2intent[intent], prob) }

        if (prob > prob_max && prob > 0.8) { prob_max = prob }
        if (prob < prob_max) {
            ind_cut = i;
            prob_max = 0;
            if (!intents.includes(intent)) { intents.push(intent) }
        }
        if (i === mots.length && !intents.includes(intent) && prob > 0.8) { intents.push(intent) }
    }
    return intents
}