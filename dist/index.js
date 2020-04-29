import { load_data } from "./load_data";
import { generate_multi_intent } from "./generate_multi_intent";
// import { Fasttext } from "./fasttext"
// import { type } from "os";
let [list_utt_int, , ,] = load_data("./data");
// var [list_utt_multi_int, multi_intents] = generate_multi_intent(list_utt_int);
let [, , ,] = generate_multi_intent(list_utt_int);
// let ft = new Fasttext();
// ft.getWordEmbedding("Hello");
// ft.getSentenceEmbedding("Hello");
// type ClassifType = 'svm' | 'deep'
// class Classifier {
//     constructor(public mode: ClassifType) {
//         this.mode = mode;
//     }
//     train() {
//     }
//     ecoin() {
//     }
// }
// // Declare your variables
// var fs = require('fs');
// var menObject;
// // Read the file, and pass it to your callback
// fs.readFile('./men.json, handleJSONFile);
//# sourceMappingURL=index.js.map