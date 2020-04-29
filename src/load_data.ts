
import { Intent, Intent2Number, Number2Intent, DatasRaw } from "./types";
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

export function load_data(path: string, nb_intents: number = -1): [DatasRaw, Intent2Number, Number2Intent] {
    let list_utt_int: DatasRaw = [];
    // Get name of each file of the directory (must contain only json files !)
    fs.readdirSync(path).forEach((file: string) => {
        // Read the file and get the json it contains
        const jsondata: Array<Array<[string, string]>> = JSON.parse(fs.readFileSync(path + "/" + file, { encoding: 'utf-8' }));

        // For each key of the json
        Object.entries(jsondata).forEach(function ([key, value]: [string, Array<[string, string]>]) {
            // Remove out of scope datasRaw
            if (!key.includes("oos")) {
                // For each array in datasRawet
                value.forEach(function (element: [string, string]) {
                    // Remove out of scope data
                    if (element[1] != "in" && element[1] != "oos") {
                        // Put utterance, intent in 
                        list_utt_int.push([element[0], [element[1]]]);
                    }
                });
            };
        });
    });
    let intents: Set<string> = new Set(list_utt_int.map(s => s[1][0]));

    if (nb_intents > 0) {
        console.log("pruning")
        let array_intent = Array.from(intents);
        array_intent.sort(() => Math.random() - 0.5);
        array_intent = array_intent.slice(0, nb_intents);
        intents = new Set(array_intent);
        list_utt_int = list_utt_int.filter(utt_int => array_intent.includes(utt_int[1][0]))
    }

    const intent2number: Intent2Number = {};
    const number2intent: Number2Intent = {};
    Array.from(intents.values()).forEach((value, index) => {
        intent2number[value] = index;
        number2intent[index] = value;
    });

    console.log(Chalk.red(list_utt_int.length), "Couple utterance / intent");
    console.log("ex : ", list_utt_int[Math.floor(Math.random() * list_utt_int.length)]);
    console.log(Chalk.cyan(intents.size), "different intents");
    return [list_utt_int, intent2number, number2intent]
}

