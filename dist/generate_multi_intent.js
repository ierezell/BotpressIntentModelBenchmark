const Chalk = require('chalk');
/**
 *
 * @param list_utt_int Liste des utterances a un seul intent
 *  Ex
 *  ```
 *  generate_multi_intent([["Coucou", "greetings"], ["Book me a flight for NY", "Book_flight"]])
 * ```
 */
export function generate_multi_intent(list_utt_int) {
    // Create new 
    const words = {
        "greetings": ["Hi", "Hello", "Hola", "Yo", "Hey", "Howdy", "greetings", "welcome", "good morning", "good afternoon", "good evening", "hi there", "hello there"],
        "thanks": ["Thanks", "Thx", "Thank you", "I appreciate", "Appreciate", "gratitude", "thank you so much", "I am grateful", "appreciated", "thank you very much", "much obliged", "many thanks", "thank-you"],
        "yes": ["Wonderful", "Yes", "Perfect", "That's perfect", "Yes please", "Affirmative", "Ok", "good", "absolutely", "yep", "okidoki", "of course", "definitely", "yeah", "agreed", "I consent", "yea", "indeed", "fine", "absolutely", "yep", "okay", "yea", "all right", "certainly", "of course", "affirmative", "definitely", "indubitably", "yeah", "agreed", "ok", "consent", "naturally", "positively", "indeed", "by all means", "assuredly", "fine", "assent", "very well", "exactly", "I accept", "aye", "unquestionably", "willingly", "good", "agree", "I agree", "precisely", "surely", "affirmatively", "I approve", "gladly", "undoubtedly", "accept", "ay"],
        "no": ["yesn't", "negative", "no way", "nix", "nay", "by no means", "not at all", "never", "nope", "nothing", "absolutely not", "refusal", "denial", "not", "none", "rejection", "hell no", "not by any means", "certainly not", "nah", "na", "shall not", "scarcely"]
    };
    const word_types = Object.keys(words);
    const list_utt_multi_int = [];
    for (let index = 0; index < 100000; index++) {
        let [sentence_1, intent_1] = list_utt_int[Math.floor(Math.random() * list_utt_int.length)];
        const base_intent = [...intent_1];
        let other_intent;
        do {
            var [sentence_2, intent_2] = list_utt_int[Math.floor(Math.random() * list_utt_int.length)];
            other_intent = [...intent_2];
        } while (base_intent === other_intent);
        if (Math.random() > 0.5) {
            const word_type = word_types[Math.floor(Math.random() * word_types.length)];
            const word = words[word_type][Math.floor(Math.random() * words[word_type].length)];
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
    let multi_intents = new Set(list_utt_multi_int.map(sub_array => sub_array[1]));
    return [list_utt_multi_int, multi_intents];
}
//# sourceMappingURL=generate_multi_intent.js.map