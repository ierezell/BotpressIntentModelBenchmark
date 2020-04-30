"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require('bluebird');
const Chalk = require('chalk');
var _ = require('lodash');
async function compute_acc(datas, model) {
    const X = datas.map(sub_array => sub_array[0]);
    const y = datas.map(sub_array => sub_array[1][0]);
    const res = await Promise.map(X, (x) => model.predict(x), { concurrency: 10000 });
    let score = 0;
    res.forEach(([pred,], index) => { if (pred === y[index]) {
        score += 1;
    } });
    console.log(`\tScore : ${(score / y.length) * 100}%  <= (${score}/${y.length})`);
}
exports.compute_acc = compute_acc;
async function compute_acc_multi(datas, model, number2intent) {
    const X = datas.map(sub_array => sub_array[0]);
    const y = datas.map(sub_array => sub_array[1]);
    const res = await Promise.map(X, (x) => predict_multi(model, x, number2intent, false), { concurrency: 10000 });
    let score = 0;
    let score_loose = 0;
    // console.log("RES", res)
    // console.log("Y", y)
    res.forEach((pred, index) => {
        if (_.isEqual(pred, y[index])) {
            // console.log(_.isEqual(pred, y[index]), pred, y[index]); 
            score += 1;
        }
        if (_.some(_.intersection(pred, y[index]))) {
            //console.log(_.some(_.intersection(pred, y[index])), pred, y[index]); 
            score_loose += 1;
        }
    });
    console.log(`\tScore multi : ${(score / y.length) * 100}%  <= (${score}/${y.length})`);
    console.log(`\tScore multi loose: ${(score_loose / y.length) * 100}%  <= (${score_loose}/${y.length})`);
}
exports.compute_acc_multi = compute_acc_multi;
async function compute_acc_greedy(datas, model, number2intent) {
    const X = datas.map(sub_array => sub_array[0]);
    const y = datas.map(sub_array => sub_array[1]);
    const res = await Promise.map(X, (x) => predict_greedy(model, x, number2intent, false), { concurrency: 1000 });
    let score = 0;
    let score_loose = 0;
    // console.log("RES")
    // res.forEach((pred) => console.log(pred.map(e => number2intent[e])))
    // console.log("REAL")
    // y.forEach((pred) => console.log(pred.map(e => number2intent[e])))
    // console.log("RES", res)
    // console.log("Y", y)
    res.forEach((pred, index) => {
        if (_.isEqual(pred, y[index])) {
            //console.log(_.isEqual(pred, y[index]), pred, y[index]); 
            score += 1;
        }
        if (_.some(_.intersection(pred, y[index]))) {
            //console.log(_.some(_.intersection(pred, y[index])), pred, y[index]);
            score_loose += 1;
        }
    });
    console.log(`\tScore greedy : ${(score / y.length) * 100}%  <= (${score}/${y.length})`);
    console.log(`\tScore greedy loose : ${(score_loose / y.length) * 100}%  <= (${score_loose}/${y.length})`);
}
exports.compute_acc_greedy = compute_acc_greedy;
async function predict_multi(model, phrase, number2intent, verbose) {
    if (verbose) {
        console.log("Phrase : ", phrase);
    }
    const probas_gauche = {};
    const probas_droite = {};
    const mots = phrase.split(" ");
    for (let i = (-mots.length / 5); i < (mots.length / 5); i++) {
        let gauche = mots.slice(0, (mots.length / 2) + i + 1);
        let droite = mots.slice((mots.length / 2) + i + 1);
        let [intent_gauche, prob_gauche] = await model.predict(gauche.join(" "));
        let [intent_droite, prob_droite] = await model.predict(droite.join(" "));
        if (!probas_gauche[intent_gauche]) {
            probas_gauche[intent_gauche] = [];
        }
        if (!probas_droite[intent_droite]) {
            probas_droite[intent_droite] = [];
        }
        probas_gauche[intent_gauche].push(prob_gauche);
        probas_droite[intent_droite].push(prob_droite);
        if (verbose) {
            console.log("gauche : ", gauche, "\n", number2intent[intent_gauche], prob_gauche);
            console.log("droite : ", droite, "\n", number2intent[intent_droite], prob_droite);
        }
    }
    const [intent_all, prob_all] = await model.predict(phrase);
    if (verbose) {
        console.log("All", prob_all, number2intent[intent_all]);
    }
    if (!probas_gauche[intent_all]) {
        probas_gauche[intent_all] = [];
    }
    if (!probas_droite[intent_all]) {
        probas_droite[intent_all] = [];
    }
    probas_gauche[intent_all].push(prob_all);
    probas_droite[intent_all].push(prob_all);
    let mean_gauche = {};
    let mean_droite = {};
    Object.entries(probas_gauche).forEach(([key, value]) => {
        mean_gauche[key] = value.reduce((curr, elt) => curr + elt, 0);
        mean_gauche[key] /= value.length;
    });
    Object.entries(probas_droite).forEach(([key, value]) => {
        mean_droite[key] = value.reduce((curr, elt) => curr + elt, 0);
        mean_droite[key] /= value.length;
    });
    if (verbose) {
        console.log("\nMeans : \n", mean_droite, "\n", mean_gauche);
    }
    const max_gauche = Object.keys(mean_gauche).reduce((a, b) => mean_gauche[a] > mean_gauche[b] ? a : b);
    const max_droite = Object.keys(mean_gauche).reduce((a, b) => mean_gauche[a] > mean_gauche[b] ? a : b);
    if (verbose) {
        console.log("Max gauche", max_gauche, "Max droite", max_droite);
    }
    const intentions = [];
    if (mean_gauche[max_gauche] > 0.5) {
        intentions.push(Number(max_gauche));
        delete mean_droite[max_gauche];
    }
    if (mean_droite[max_droite] > 0.5) {
        intentions.push(Number(max_droite));
    }
    if (!intentions.length) {
        intentions.push(intent_all);
    }
    return intentions;
}
async function predict_greedy(model, phrase, number2intent, verbose) {
    if (verbose) {
        console.log("Phrase : ", phrase);
    }
    let maxi = 0;
    let ind_cut = 0;
    const intents = [];
    const mots = phrase.split(" ");
    for (let i = 1; i <= (mots.length); i++) {
        let cutted_mots = mots.slice(ind_cut, i);
        if (verbose) {
            console.log(cutted_mots);
        }
        let [intent, prob] = await model.predict(cutted_mots.join(" "));
        if (verbose) {
            console.log(number2intent[intent], prob);
        }
        if (prob > maxi && prob > 0.3) {
            maxi = prob;
        }
        if (prob < maxi) {
            ind_cut = i;
            maxi = 0;
            if (!intents.includes(intent)) {
                intents.push(intent);
            }
        }
        if (i === mots.length && !intents.includes(intent) && prob > 0.3) {
            intents.push(intent);
        }
    }
    return intents;
}
//# sourceMappingURL=accuracy.js.map