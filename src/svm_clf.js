"use strict";
exports.__esModule = true;
var svm = require('./node-svm');
var Svm_clf = /** @class */ (function () {
    function Svm_clf() {
        this.clf = new svm.CSVC({
            kernel: "LINEAR",
            probability: true,
            normalize: false,
            reduce: false
        });
        // if (restore) {
        //     this.clf = svm.restore(model);
        // }
    }
    Svm_clf.prototype.train = function (datas) {
        this.clf.train(datas);
    };
    Svm_clf.prototype.predict = function (data) {
        return this.clf.predictProbabilitiesSync(data);
    };
    return Svm_clf;
}());
exports.Svm_clf = Svm_clf;
