"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_data_1 = require("./load_data");
const generate_multi_intent_1 = require("./generate_multi_intent");
const types_1 = require("./types");
const poutinerie_1 = require("./poutinerie");
let params = {
    svm: false,
    deep: true,
    train: true,
    acc: true,
    acc_multi: true,
    acc_greedy: false,
    load: false,
    save: false
};
let list_utt_multi_num_int = [];
let number2intent_multi = {};
const [list_utt_int, intent2number, number2intent] = load_data_1.load_data("./data", 5);
if (params.acc_multi) {
    const list_utt_multi_int = generate_multi_intent_1.generate_multi_intent(list_utt_int);
    const last_intent = Object.keys(number2intent).length;
    const new_numbers2intent = {
        [last_intent + 1]: "greeting",
        [last_intent + 2]: "thanks",
        [last_intent + 3]: "yes",
        [last_intent + 4]: "no"
    };
    const new_intent2number = {
        "greeting": last_intent + 1,
        "thanks": last_intent + 2,
        "yes": last_intent + 3,
        "no": last_intent + 4
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
}
const list_utt_num_int = list_utt_int.map(s => [s[0], s[1].map((intention) => intent2number[intention])]);
poutinerie_1.poutine(list_utt_num_int, params, list_utt_multi_num_int, number2intent_multi).then(() => console.log("All Done"));
//# sourceMappingURL=index.js.map