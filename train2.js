
const fs = require("fs");
const stopwords = require('stopwords-es');
const brain = require('brain.js');


const commentsDir = '../comments';
const commentsPath = commentsDir + '/comments.txt';
const comments = fs.readFileSync(commentsPath, 'binary');

// split corpus in sentences (each sentence is a document for TFIDF)
let sentences = comments.split('.').map(s => s.toLowerCase());
// create the vocabulary (array of unique words)
const words = {};
sentences.forEach(s => {
    let s_arr = s.split(' ').filter(word => stopwords.indexOf(word) === -1 && word !== '');
    s_arr.forEach(w => words[w] = '');
});
const vocabulary = Object.keys(words);
const totalWords = vocabulary.length;

const tokenize = function (s) {
    let sentence = s.text || s;
    let vocArr = new Array(totalWords);
    let vv = 0;
    for (; vv < totalWords; vv++) {
        let word = vocabulary[vv];
        let timesIsWordInSentence = (sentence.match(new RegExp(word, 'g')) || []).length;
        vocArr[vv] = timesIsWordInSentence > 0 ? 1 : 0;
    }
    return vocArr;
}

// turn sentence into obj
sentences = sentences.map(s => {
    return {
        text: s,
        token: tokenize(s),
        tf: new Array(totalWords),
        idf: new Array(totalWords),
        tfidf: new Array(totalWords)
    }
});




const sentencesMax = sentences.length;
let ss = 0;
const sentencesVector = new Array(sentencesMax);
// const tfVector = new Array(sentencesMax);
for (; ss < sentencesMax; ss++) {
    let vocArr = new Array(totalWords);
    // let tfArr = new Array(sentencesMax);
    let vv = 0;
    for (; vv < totalWords; vv++) {
        let word = vocabulary[vv];
        // let totalWordsInSentence = (sentences[ss].match(/[a-záéíóúñäëïöüâêîôûàèìòù]+/gi) || []).length;
        let timesIsWordInSentence = (sentences[ss].match(new RegExp(word, 'g')) || []).length;
        // let tf = timesIsWordInSentence / totalWordsInSentence;
        // tfArr[vv] = timesIsWordInSentence;
        vocArr[vv] = timesIsWordInSentence > 0 ? 1 : 0;
    }
    sentencesVector[ss] = vocArr;
    // tfVector[ss] = tfArr;
}

// console.log(tfVector);

const dataset = sentences.map((s, $index) => {
    let obj = { input: sentencesVector[$index], output: {} };
    return obj;
});

dataset[0].output['agua'] = 1;
dataset[1].output['agua'] = 1;
dataset[2].output['agua'] = 1;
dataset[3].output['luz'] = 1;
dataset[4].output['luz'] = 1;
dataset[5].output['luz'] = 1;
dataset[6].output['calles'] = 1;
dataset[7].output['calles'] = 1;
dataset[8].output['calles'] = 1;

console.log(dataset);

// create net

// provide optional config object (or undefined). Defaults shown.
const config = {
    binaryThresh: 0.5,
    hiddenLayers: [3],     // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid',  // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.01   // supported for activation type 'leaky-relu'
};

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config);
net.train(dataset);

const output = net.run([0,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0]);
console.log(output);

const preProcessSamples = function (dataset) {
    const newDataSet = [];
    const datasetMax = dataset.length;
    let dd = 0;
    for (; dd < datasetMax; dd++) {
        let data = dataset[dd];
        let inputs = data.input.map(i => [i]);
        let target;
        switch (data.output[Object.keys(data.output)[0]]) {
            case 'agua':
                target = math.matrix([[1], [0], [0]]);
                break;
            case 'luz':
                target = math.matrix([[0], [1], [0]]);
                break;
            case 'calles':
                target = math.matrix([[0], [0], [1]]);
                break;
        }
        newDataSet.push({ inputs: inputs, target: target });
    }
    return newDataSet;
}

const nn = new NeuralNetwork(totalWords, 3, 3);
let trainingData = preProcessSamples(dataset);
nn.train(trainingData);
nn.guess([[0], [1], [0], [0], [0], [0], [1], [1], [1], [1], [1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]]);