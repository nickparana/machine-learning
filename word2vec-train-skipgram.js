
const NeuralNetwork = require('./skipgram-neuronal-network');
const stopwords = require('stopwords-es');



this.removeStopwords = function (sentence) {
    let sentenceWords = sentence.split(' ');
    let filteredWords = sentenceWords.filter(w => stopwords.indexOf(w) === -1);
    return filteredWords.join(' ');
}

let text = "me gusta tocar la guitarra.amo tocar la flauta.no se tocar el trombón pero me gusta tocar el clarinete.odio tocar la flauta";
let sentences = text.toLowerCase().split('.').map(this.removeStopwords);

let vocArr = [];


const tokenizeVoc = {};
const detokenizeVoc = {};
const trainingData = [];


this.setup = function () {

    // remove duplicates
    vocArr = text.toLowerCase()
        .replace(/[.]/g, ' ')
        .split(' ')
        .filter(w => stopwords.indexOf(w) === -1)
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
    const windowSize = sentenceMaxVoc - 1; // longest
    // const windowSize = 2; 
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
        trainingData.push({ input: sentenceArr[v], target: wordInputs });
    }
}


this.setup();

const vocSize = vocArr.length;
const inputLayerSize = vocSize;
const outputLayerSize = vocSize;
const hiddenLayerSize = 50;
const learningRate = 0.05;
const batches = 1000;

const nn = new NeuralNetwork(inputLayerSize, hiddenLayerSize, outputLayerSize, learningRate, batches);
nn.train(trainingData);

let centerWord = "flauta";
let tokenizedCenterWord = tokenizeVoc[centerWord];

const outputDic = {};
nn.guess(tokenizedCenterWord).map((e, idx) => outputDic[vocArr[idx]] = e);

const noDuplicatesOutput = {};
for (let [key, value] of Object.entries(outputDic)) {
    if (tokenizedCenterWord !== tokenizeVoc[key]) {
        noDuplicatesOutput[key] = value;
    }
}

// Create items array
var items = Object.keys(noDuplicatesOutput).map(function (key) {
    return [key, noDuplicatesOutput[key]];
});

// Sort the array based on the second element
items.sort(function (first, second) {
    return second[1] - first[1];
});

console.log('center word: ', centerWord);
console.log(items);

let word = 'guitarra';
let tokenizedWord = tokenizeVoc[word];
let similarities = nn.similarity(tokenizedWord);


console.log('------SIMILARITIES---------')
vocArr.forEach((word, index) => {
    console.log(word, similarities[index]);
})



