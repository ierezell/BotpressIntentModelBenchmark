"use strict";
exports.__esModule = true;
var Chalk = require('chalk');
var fs = require('fs');
/**
 *
 * @param path chamin du dossier contenant les json
 *  Ex
 *  ```
 *  load_data("./data"])
 * ```
 * Used then in {@link generate_multi_intent}
 */
function load_data(path) {
    var list_utt_int = [];
    // Get name of each file of the directory (must contain only json files !)
    fs.readdirSync(path).forEach(function (file) {
        // Read the file and get the json it contains
        var jsondata = JSON.parse(fs.readFileSync(path + "/" + file, { encoding: 'utf-8' }));
        // For each key of the json
        Object.entries(jsondata).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            // Remove out of scope datas
            if (!key.includes("oos")) {
                // For each array in dataset
                value.forEach(function (element) {
                    // Remove out of scope data
                    if (element[1] != "in" && element[1] != "oos") {
                        // Put utterance, intent in 
                        list_utt_int.push([element[0], [element[1]]]);
                    }
                });
            }
            ;
        });
    });
    var intents = new Set(list_utt_int.map(function (sub_array) { return sub_array[1][0]; }));
    console.log(Chalk.red(list_utt_int.length), "Couple utterance / intent");
    console.log("ex : ", list_utt_int[Math.floor(Math.random() * list_utt_int.length)]);
    console.log(Chalk.cyan(intents.size), "different intents");
    return [list_utt_int, intents];
}
exports.load_data = load_data;
