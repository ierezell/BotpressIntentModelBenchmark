var svm = require('./custom-modules/node-svm');
export class Svm_clf {
    constructor() {
        this.clf = new svm.CSVC({
            kernel: "LINEAR",
            probability: true,
            normalize: false,
            reduce: false,
        });
        // if (restore) {
        //     this.clf = svm.restore(model);    
        // }
    }
    train(datas) {
        this.clf.train(datas);
    }
    predict(data) {
        return this.clf.predictProbabilitiesSync(data);
    }
}
//# sourceMappingURL=svm_clf.js.map