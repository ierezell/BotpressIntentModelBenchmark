
import { load_data } from "./load_data";
import { generate_multi_intent } from "./generate_multi_intent";
import { Intent, Intent2Number, Number2Intent, DatasRaw, DatasNum, OptionsPoutine, words, WordType } from "./types"
import { poutine } from "./poutinerie"
const Chalk = require('chalk');


let params: OptionsPoutine = {
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
}

let list_utt_multi_num_int: DatasNum = [];
let number2intent_multi: Number2Intent = {};
let list_utt_num_int: DatasNum = [];

const [list_utt_int, intent2number, number2intent]:
    [DatasRaw, Intent2Number, Number2Intent] = load_data("./datas/covid_id/fr", params.nb_int, params.nb_utt);


if (params.acc_multi) {
    const list_utt_multi_int: DatasRaw = generate_multi_intent(list_utt_int);

    const last_intent: number = Object.keys(number2intent).length;

    const new_numbers2intent: Number2Intent = {
        [last_intent]: "greeting",
        [last_intent + 1]: "thanks",
        [last_intent + 2]: "yes",
        [last_intent + 3]: "no"
    }
    const new_intent2number: Intent2Number = {
        "greetings": last_intent,
        "thanks": last_intent + 1,
        "yes": last_intent + 2,
        "no": last_intent + 3
    }

    const intent2number_multi: Intent2Number = {};

    Object.assign(number2intent_multi, number2intent, new_numbers2intent)
    Object.assign(intent2number_multi, intent2number, new_intent2number)


    list_utt_multi_num_int = list_utt_multi_int.map(
        s => [s[0], s[1].map((intention: string) => intent2number_multi[intention])]
    );


    for (const key in words) {
        for (const utt of words[key as WordType]) {
            list_utt_int.push([utt, [key]]);
        }
    }

    list_utt_num_int = list_utt_int.map(
        s => [s[0], s[1].map((intention: string) => intent2number_multi[intention])]
    );

    console.log("Adding data from multi-utt");
    console.log("Now having", Chalk.red(list_utt_int.length), "utterance / single intents");
    console.log("Adding {thanks no yes greetings} lead to", Chalk.cyan(Object.keys(intent2number_multi).length), "different single intents \n");
} else {
    list_utt_num_int = list_utt_int.map(
        s => [s[0], s[1].map((intention: string) => intent2number[intention])]
    );

}


poutine(list_utt_num_int, params, list_utt_multi_num_int, number2intent_multi).then(() => console.log("All Done"))


