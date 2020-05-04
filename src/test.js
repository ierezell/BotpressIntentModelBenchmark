const pred_probs = [9, 2, 8, 4, 1, 3, 5, 6, 7];

let max_1 = 0;
let max_2 = 0;
let max_3 = 0;
let idx_1 = 0;
let idx_2 = 0;
let idx_3 = 0;
for (let i = 0; i < pred_probs.length; i++) {
    if (pred_probs[i] > max_1) { max_1 = pred_probs[i]; idx_1 = i }
    if (pred_probs[i] > max_2 && pred_probs[i] < max_1) { max_2 = pred_probs[i]; idx_2 = i }
    if (pred_probs[i] > max_3 && pred_probs[i] < max_1 && pred_probs[i] < max_2) { max_3 = pred_probs[i]; idx_3 = i }

}

console.log(max_1, max_2, max_3)
console.log(idx_1, idx_2, idx_3)
console.log([idx_1, idx_2, idx_3].map((e, i) => [e, [max_1, max_2, max_3][i]]))