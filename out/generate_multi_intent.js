"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const Chalk = require('chalk');
/**
 *
 * @param list_utt_int Liste des utterances a un seul intent
 *  Ex
 *  ```
 *  generate_multi_intent([["Coucou", "greetings"], ["Book me a flight for NY", "Book_flight"]])
 * ```
 */
function generate_multi_intent(list_utt_int) {
    const word_types = Object.keys(types_1.words);
    const list_utt_multi_int = [];
    for (let index = 0; index < 100000; index++) {
        const [sentence_1, intent_1] = list_utt_int[Math.floor(Math.random() * list_utt_int.length)];
        const base_intent = [...intent_1];
        let other_intent;
        do {
            var [sentence_2, intent_2] = list_utt_int[Math.floor(Math.random() * list_utt_int.length)];
            other_intent = [...intent_2];
        } while (base_intent === other_intent);
        if (Math.random() > 0.5) {
            const word_type = word_types[Math.floor(Math.random() * word_types.length)];
            const word = types_1.words[word_type][Math.floor(Math.random() * types_1.words[word_type].length)];
            const sep = Math.random() > 0.5 ? " " : ", ";
            const phrase = word + sep + sentence_1;
            base_intent.unshift(word_type);
            list_utt_multi_int.push([phrase, base_intent]);
        }
        else {
            const coin = Math.random();
            let phrase = "";
            switch (true) {
                case (coin < 0.33):
                    phrase = sentence_1 + " and " + sentence_2;
                    break;
                case (coin < 0.66):
                    phrase = sentence_1 + " then " + sentence_2;
                    break;
                case (coin < 1.0):
                    phrase = sentence_1 + ", " + sentence_2;
                    break;
            }
            list_utt_multi_int.push([phrase, base_intent.concat(other_intent)]);
        }
    }
    console.log(Chalk.red(list_utt_multi_int.length), "Couple utterance / multi intent");
    console.log("ex : ", list_utt_multi_int[Math.floor(Math.random() * list_utt_multi_int.length)]);
    return list_utt_multi_int;
}
exports.generate_multi_intent = generate_multi_intent;
//# sourceMappingURL=generate_multi_intent.js.map