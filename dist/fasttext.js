var fastText = require('../custom-modules/node-fasttext');
console.log("fasttttt", fastText);
export class Fasttext {
    constructor() {
        // this.embedder = new fastText.Classifier()
        // this.embedder.loadModel("/home/pedro/git_clones/oos-eval/data/cc.en.300.bin").then(console.log("Model loaded"));
        // this.embedder = new fastText.Classifier("/home/pedro/git_clones/oos-eval/data/cc.en.300.bin")
        this.embedder = new fastText.Query("/home/pedro/git_clones/oos-eval/cc.en.300.bin");
    }
    async getWordEmbedding(phrase) {
        console.log("Trying Test");
        let res = await this.embedder.getWordVector("Hydrate");
        res = await this.embedder.getWordVector(phrase);
        // console.log(Object.getOwnPropertyNames(this.embedder))
        console.log(res);
    }
    ;
}
//# sourceMappingURL=fasttext.js.map