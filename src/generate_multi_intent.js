"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Chalk = require('chalk');
/**
 *
 * @param list_utt_int Liste des utterances a un seul intent
 *  Ex
 *  ```
 *  generate_multi_intent([["Coucou", "greetings"], ["Book me a flight for NY", "Book_flight"]])
 * ```
 * Used then in {@link generate_multi_intent}
 */
function generate_multi_intent(list_utt_int) {
    // Create new 
    var words = {
        "greetings": ["Hi", "Hello", "Hola", "Yo", "Hey", "Howdy", "greetings", "welcome", "good morning", "good afternoon", "good evening", "hi there", "hello there"],
        "thanks": ["Thanks", "Thx", "Thank you", "I appreciate", "Appreciate", "gratitude", "thank you so much", "I am grateful", "appreciated", "thank you very much", "much obliged", "many thanks", "thank-you"],
        "yes": ["Wonderful", "Yes", "Perfect", "That's perfect", "Yes please", "Affirmative", "Ok", "good", "absolutely", "yep", "okidoki", "of course", "definitely", "yeah", "agreed", "I consent", "yea", "indeed", "fine", "absolutely", "yep", "okay", "yea", "all right", "certainly", "of course", "affirmative", "definitely", "indubitably", "yeah", "agreed", "ok", "consent", "naturally", "positively", "indeed", "by all means", "assuredly", "fine", "assent", "very well", "exactly", "I accept", "aye", "unquestionably", "willingly", "good", "agree", "I agree", "precisely", "surely", "affirmatively", "I approve", "gladly", "undoubtedly", "accept", "ay"],
        "no": ["yesn't", "negative", "no way", "nix", "nay", "by no means", "not at all", "never", "nope", "nothing", "absolutely not", "refusal", "denial", "not", "none", "rejection", "hell no", "not by any means", "certainly not", "nah", "na", "shall not", "scarcely"]
    };
    var word_types = Object.keys(words);
    var list_utt_multi_int = [];
    for (var index = 0; index < 100000; index++) {
        var _a = list_utt_int[Math.floor(Math.random() * list_utt_int.length)], sentence_1 = _a[0], intent_1 = _a[1];
        var base_intent = __spreadArrays(intent_1);
        var other_intent = void 0;
        do {
            var _b = list_utt_int[Math.floor(Math.random() * list_utt_int.length)], sentence_2 = _b[0], intent_2 = _b[1];
            other_intent = __spreadArrays(intent_2);
        } while (base_intent === other_intent);
        if (Math.random() > 0.5) {
            var word_type = word_types[Math.floor(Math.random() * word_types.length)];
            var word = words[word_type][Math.floor(Math.random() * words[word_type].length)];
            var sep = Math.random() > 0.5 ? " " : ", ";
            var phrase = word + sep + sentence_1;
            base_intent.unshift(word_type);
            list_utt_multi_int.push([phrase, base_intent]);
        }
        else {
            var coin = Math.random();
            var phrase = "";
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
    var multi_intents = new Set(list_utt_multi_int.map(function (sub_array) { return sub_array[1]; }));
    var intent2number = {};
    var number2intent = {};
    for (var i = 0; i < multi_intents.size; i++) {
        intent2number[multi_intents[i]] = i;
        number2intent[i] = multi_intents[i];
    }
    return [list_utt_multi_int, multi_intents, intent2number, number2intent];
}
exports.generate_multi_intent = generate_multi_intent;
