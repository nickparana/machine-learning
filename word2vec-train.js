
const NeuralNetwork = require('./word2vec-neuronal-network');

let text = "Como hago para tocar la guitarra.Como hago para tocar la flauta.Como para para tocar la viola.Como hago para tocar la guitarra.Como hago para tocar la flauta y la viola";
let sentences = text.split('.');
let vocArr = [];


const tokenizeVoc = {};
const detokenizeVoc = {};
const trainingData = [];

this.setup = function () {
   
    // remove duplicates
    vocArr = text
        .replace(/[.]/g, ' ')
        .split(' ')
        .filter((elem, pos, arr) => {
            return arr.indexOf(elem) == pos;
        });    

    let s = 0;
    const sentencesMax = sentences.length;
    for (; s < sentencesMax; s++) {
        this.tokenizeVoc(sentences[s].split(' '));
        this.preprocess(sentences[s]);
    }
}

this.tokenizeVoc = function () {
    let v = 0;
    const maxVoc = vocArr.length;
    for (; v < maxVoc; v++) {
        let oneHotWord = new Array(maxVoc).fill(0);
        oneHotWord[v] = 1;
        tokenizeVoc[vocArr[v]] = oneHotWord;
        detokenizeVoc[oneHotWord] = vocArr[v];
    }
}

this.preprocess = function (sentence) {
    const sentenceArr = sentence.split(' ').map(e => tokenizeVoc[e]);
    const sentenceMaxVoc = sentenceArr.length;
    // const windowSize = sentenceMaxVoc - 1; // longest
    const windowSize = 2; // longest
    const windowTotal = windowSize * 2 + 1;
    let v = 0;
    for (; v < sentenceMaxVoc; v++) {
        let it = 0;
        let w = v - windowSize;
        let wordInputs = [];
        while (it < windowTotal) {
            if (w >= 0 && sentenceArr[w] !== sentenceArr[v] && !!sentenceArr[w]) {
                wordInputs.push(sentenceArr[w]);
            }
            it++;
            w++;
        }
        trainingData.push({ input: wordInputs, target: sentenceArr[v] });
    }
}


this.setup();

const vocSize = vocArr.length;
const inputLayerSize = vocSize;
const outputLayerSize = vocSize;
const hiddenLayerSize = 300;
const learningRate = 0.5;
const batches = 100;

const nn = new NeuralNetwork(inputLayerSize, hiddenLayerSize, outputLayerSize, learningRate, batches);
nn.train(trainingData);

let context = "Como hago para";
let tokenizeContext = context.split(' ').map(e => tokenizeVoc[e]);
let guessInputs = new Array(...tokenizeContext);

const outputDic = {};
nn.guess(guessInputs).map((e, idx) => outputDic[vocArr[idx]] = e);
const noDuplicatesOutput = {};
for (let [key, value] of Object.entries(outputDic)) {
    if (guessInputs.indexOf(tokenizeVoc[key]) === -1) {
        noDuplicatesOutput[key] = value;
    }
}

// Create items array
var items = Object.keys(noDuplicatesOutput).map(function(key) {
    return [key, noDuplicatesOutput[key]];
  });
  
  // Sort the array based on the second element
  items.sort(function(first, second) {
    return second[1] - first[1];
  });

console.log(items);

