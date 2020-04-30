"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chalk = require('chalk');
const fs = require('fs');
/// <reference path="./generate_multi_intent.ts" />
/**
 *
 * @param path chamin du dossier contenant les json
 *  Ex
 *  ```
 *  load_data("./data"])
 * ```
 * Used then in @see{@link {[ici]{ generate_multi_intent.generate_multi_intent } } }
 */
function load_data(path, nb_intents = -1, nb_utt = -1) {
    let list_utt_int_raw = [];
    // Get name of each file of the directory (must contain only json files !)
    fs.readdirSync(path).forEach((file) => {
        // Read the file and get the json it contains
        const jsondata = JSON.parse(fs.readFileSync(path + "/" + file, { encoding: 'utf-8' }));
        // For each key of the json
        Object.entries(jsondata).forEach(function ([key, value]) {
            // Remove out of scope datasRaw
            if (!key.includes("oos")) {
                // For each array in datasRawet
                value.forEach(function (element) {
                    // Remove out of scope data
                    if (element[1] != "in" && element[1] != "oos") {
                        // Put utterance, intent in 
                        list_utt_int_raw.push([element[0], [element[1]]]);
                    }
                });
            }
            ;
        });
    });
    let intents = new Set(list_utt_int_raw.map(s => s[1][0]));
    if (nb_intents > 0) {
        console.log(Chalk.red(`\nReducing number of intents to ${nb_intents}`));
        let array_intent = Array.from(intents);
        array_intent.sort(() => Math.random() - 0.5);
        array_intent = array_intent.slice(0, nb_intents);
        intents = new Set(array_intent);
        list_utt_int_raw = list_utt_int_raw.filter(utt_int => array_intent.includes(utt_int[1][0]));
    }
    let list_utt_int = [];
    if (nb_utt > 0) {
        console.log(Chalk.red(`Reducing number of utterances per intent to ${nb_utt}\n`));
        let nb_utt_intent = {};
        intents.forEach((int) => nb_utt_intent[int] = 0);
        list_utt_int_raw.sort(() => Math.random() - 0.5);
        for (const [utt, int] of list_utt_int_raw) {
            if (nb_utt_intent[int[0]] < nb_utt) {
                list_utt_int.push([utt, int]);
                nb_utt_intent[int[0]] += 1;
            }
        }
    }
    else {
        list_utt_int = list_utt_int_raw;
    }
    const intent2number = {};
    const number2intent = {};
    Array.from(intents.values()).forEach((value, index) => {
        intent2number[value] = index;
        number2intent[index] = value;
    });
    console.log(Chalk.red(list_utt_int.length), "Couple utterance / intent");
    console.log(Chalk.cyan(intents.size), "different intents");
    console.log("ex : ", list_utt_int[Math.floor(Math.random() * list_utt_int.length)], "\n");
    return [list_utt_int, intent2number, number2intent];
}
exports.load_data = load_data;
//# sourceMappingURL=load_data.js.map