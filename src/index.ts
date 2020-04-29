
import { load_data } from "./load_data";
import { generate_multi_intent } from "./generate_multi_intent";
import { Intent, Intent2Number, Number2Intent, DatasRaw, DatasNum, OptionsPoutine, words, WordType } from "./types"
import { poutine } from "./poutinerie"


let params: OptionsPoutine = {
    svm: false,
    deep: true,
    train: true,
    acc: true,
    acc_multi: true,
    acc_greedy: false,
    load: false,
    save: false
}

let list_utt_multi_num_int: DatasNum = [];
let number2intent_multi: Number2Intent = {};

const [list_utt_int, intent2number, number2intent]:
    [DatasRaw, Intent2Number, Number2Intent] = load_data("./data", 5);


if (params.acc_multi) {
    const list_utt_multi_int: DatasRaw = generate_multi_intent(list_utt_int);
    const last_intent: number = Object.keys(number2intent).length;
    const new_numbers2intent: Number2Intent = {
        [last_intent + 1]: "greeting",
        [last_intent + 2]: "thanks",
        [last_intent + 3]: "yes",
        [last_intent + 4]: "no"
    }
    const new_intent2number: Intent2Number = {
        "greeting": last_intent + 1,
        "thanks": last_intent + 2,
        "yes": last_intent + 3,
        "no": last_intent + 4
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

}

const list_utt_num_int: DatasNum = list_utt_int.map(
    s => [s[0], s[1].map((intention: string) => intent2number[intention])]
);

poutine(list_utt_num_int, params, list_utt_multi_num_int, number2intent_multi).then(() => console.log("All Done"))
