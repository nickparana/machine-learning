
const fs = require("fs");
const stopwords = require('stopwords-es');
const brain = require('brain.js');
const NeuralNetwork = require('./word2vec-neuronal-network');
const math = require('mathjs');

const commentsDir = '../comments';
const commentsPath = commentsDir + '/comments.txt';
const comments = fs.readFileSync(commentsPath, 'binary');

// const text = "Odio los pozos de Paraná.Paraná es una ciudad sucia.Se me cortó la luz.Se me cortó el agua.Se me cortó el gas.Se me cortó el teléfono.Mi vecino hace ruido.Mi vecino es una mala persona.Varisco no sirve para nada.";
const sentences = comments.split('.').map(w => w.toLowerCase());
const words = {};

sentences.forEach(s => {
    let s_arr = s.split(' ').filter(word => stopwords.indexOf(word) === -1 && word !== '');
    s_arr
        .map(w => {
            let str = w.replace(/\\b|\\n|\\r|\s+/gi, '');
            return str;
        })
        .forEach(w => words[w] = '');
});

const tokenize = function (sentence) {
    let vocArr = new Array(vocMax);
    let vv = 0;
    for (; vv < vocMax; vv++) {
        let word = vocabulary[vv];
        let timesIsWordInSentence = (sentence.match(new RegExp(word, 'g')) || []).length;
        vocArr[vv] = timesIsWordInSentence > 0 ? 1 : 0;
    }
    return vocArr;
}

const vocabulary = Object.keys(words);
const sentencesMax = sentences.length;
const vocMax = vocabulary.length;
let ss = 0;
const sentencesVector = new Array(sentencesMax);
// const tfVector = new Array(sentencesMax);
for (; ss < sentencesMax; ss++) {
    // let vocArr = new Array(vocMax);
    // // let tfArr = new Array(sentencesMax);
    // let vv = 0;
    // for (; vv < vocMax; vv++) {
    //     let word = vocabulary[vv];
    //     // let totalWordsInSentence = (sentences[ss].match(/[a-záéíóúñäëïöüâêîôûàèìòù]+/gi) || []).length;
    //     let timesIsWordInSentence = (sentences[ss].match(new RegExp(word, 'g')) || []).length;
    //     // let tf = timesIsWordInSentence / totalWordsInSentence;
    //     // tfArr[vv] = timesIsWordInSentence;
    //     vocArr[vv] = timesIsWordInSentence > 0 ? 1 : 0;
    // }   
    sentencesVector[ss] = tokenize(sentences[ss]);
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
dataset[3].output['agua'] = 1;
dataset[4].output['agua'] = 1;
dataset[5].output['agua'] = 1;
dataset[6].output['luz'] = 1;
dataset[7].output['luz'] = 1;
dataset[8].output['luz'] = 1;
dataset[9].output['luz'] = 1;
dataset[10].output['luz'] = 1;
dataset[11].output['luz'] = 1;
dataset[12].output['luz'] = 1;
dataset[13].output['luz'] = 1;
dataset[14].output['luz'] = 1;
dataset[15].output['agua'] = 1;
dataset[16].output['agua'] = 1;
dataset[17].output['agua'] = 1;
dataset[18].output['luz'] = 1;
dataset[19].output['agua'] = 1;
dataset[20].output['luz'] = 1;
dataset[21].output['agua'] = 1;
dataset[22].output['luz'] = 1;
dataset[23].output['agua'] = 1;
dataset[24].output['luz'] = 1;
dataset[25].output['agua'] = 1;
dataset[26].output['luz'] = 1;
dataset[27].output['agua'] = 1;
dataset[28].output['luz'] = 1;
dataset[29].output['agua'] = 1;
dataset[30].output['luz'] = 1;
dataset[31].output['agua'] = 1;
dataset[32].output['luz'] = 1;
dataset[33].output['agua'] = 1;
dataset[34].output['luz'] = 1;
dataset[35].output['agua'] = 1;
dataset[36].output['luz'] = 1;
dataset[37].output['agua'] = 1;

const preProcessSamples = function (dataset) {
    const newDataSet = [];
    const datasetMax = dataset.length;
    let dd = 0;
    for (; dd < datasetMax; dd++) {
        let data = dataset[dd];
        let inputs = data.input.map(i => [i]);
        let target;
        let type = Object.keys(data.output)[0];
        switch (type) {
            case 'agua':
                target = math.matrix([[1], [0]]);
                break;
            case 'luz':
                target = math.matrix([[0], [1]]);
                break;
        }
        newDataSet.push({ inputs: inputs, target: target });
    }
    return newDataSet;
}

// my net
const nn = new NeuralNetwork(vocMax, 3, 2, 5, 2);
let trainingData = preProcessSamples(dataset);
nn.train(trainingData);
let sentenceToGuess = "No puedo lavar la ropa";
let inputToGuess = tokenize(sentenceToGuess).map(i => [i]);
let guess = nn.guess(inputToGuess);

console.log('Sentence to guess: ', sentenceToGuess);


console.log('------ [My Neuronal Net] -----------------------------------------------------')
console.log(guess);


// brain.js
// provide optional config object (or undefined). Defaults shown.
const config = {
    binaryThresh: 0.5,
    hiddenLayers: [3],     // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid',  // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.01   // supported for activation type 'leaky-relu'
};

const net = new brain.NeuralNetwork(config);
net.train(dataset);
const output = net.run(inputToGuess);
console.log('------ [Brain.js] -----------------------------------------------------')
console.log(output);