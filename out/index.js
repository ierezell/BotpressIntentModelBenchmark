"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_data_1 = require("./load_data");
const generate_multi_intent_1 = require("./generate_multi_intent");
const types_1 = require("./types");
const poutinerie_1 = require("./poutinerie");
const Chalk = require('chalk');
// ///////////////////////////////////////////////////////////////////////////////
// Il faut lancer python craft_dataset_covid.py avant de lancer ce script ! //////
//                   Les options sont donnees dans le fichier python        //////
//     Ensuite precisez le repertoire covid_ctx ou covid_id ainsi que fr ou en////
// ///////////////////////////////////////////////////////////////////////////////
let params = {
    nb_int: -1,
    nb_utt: -1,
    // embed: "use",
    embed: "bert",
    // embed: "fasttext",
    svm: true,
    deep: true,
    train: true,
    acc: true,
    acc_multi: false,
    acc_greedy: false,
    load: false,
    save: false
};
let list_utt_multi_num_int = [];
let number2intent_multi = {};
let list_utt_num_int = [];
const [list_utt_int, intent2number, number2intent] = load_data_1.load_data("./datas/covid_id/fr", params.nb_int, params.nb_utt);
if (params.acc_multi) {
    const list_utt_multi_int = generate_multi_intent_1.generate_multi_intent(list_utt_int);
    const last_intent = Object.keys(number2intent).length;
    const new_numbers2intent = {
        [last_intent]: "greeting",
        [last_intent + 1]: "thanks",
        [last_intent + 2]: "yes",
        [last_intent + 3]: "no"
    };
    const new_intent2number = {
        "greetings": last_intent,
        "thanks": last_intent + 1,
        "yes": last_intent + 2,
        "no": last_intent + 3
    };
    const intent2number_multi = {};
    Object.assign(number2intent_multi, number2intent, new_numbers2intent);
    Object.assign(intent2number_multi, intent2number, new_intent2number);
    list_utt_multi_num_int = list_utt_multi_int.map(s => [s[0], s[1].map((intention) => intent2number_multi[intention])]);
    for (const key in types_1.words) {
        for (const utt of types_1.words[key]) {
            list_utt_int.push([utt, [key]]);
        }
    }
    list_utt_num_int = list_utt_int.map(s => [s[0], s[1].map((intention) => intent2number_multi[intention])]);
    console.log("Adding data from multi-utt");
    console.log("Now having", Chalk.red(list_utt_int.length), "utterance / single intents");
    console.log("Adding {thanks no yes greetings} lead to", Chalk.cyan(Object.keys(intent2number_multi).length), "different single intents \n");
}
else {
    list_utt_num_int = list_utt_int.map(s => [s[0], s[1].map((intention) => intent2number[intention])]);
}
poutinerie_1.poutine(list_utt_num_int, params, list_utt_multi_num_int, number2intent_multi).then(() => console.log("All Done"));
//# sourceMappingURL=index.js.map