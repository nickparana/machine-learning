const fs = require("fs");

const vocabulary = {};

// read JSON file
let sentencesPath = './logs/sentences/sentences.json'
let file = fs.readFileSync(sentencesPath, 'binary');

// get sentences
const sentences = JSON.parse(file).sentences;

// split sentences
sentences.forEach(sentence => {
    let words = sentence.value.split(' ');
    words.forEach(word => {
        // push into dictionary
        if (vocabulary.hasOwnProperty(word)) {
            vocabulary[word] = vocabulary[word] + 1;
            return;
        }
        vocabulary[word] = 1;
    })
});

// sort by number of occurrences
const keys = Object.keys(vocabulary);
const items = keys.map(key => [key, vocabulary[key]]);
const sortedItems = items
    .sort((first, second) => second[1] - first[1])
    .map(item => item = { 'value': item[0], 'count': item[1] });

const vocabularyJSON = JSON.stringify({
    total: keys.length,
    words: sortedItems
});

// create vocabulary dir
const vocabularyDir = './logs/vocabulary';
if (!fs.existsSync(vocabularyDir)) {
    fs.mkdirSync(vocabularyDir);
}

// delete vocabulary file if exists
let vocPath = `${vocabularyDir}/vocabulary.json`
if (fs.existsSync(vocPath)) {
    fs.unlinkSync(vocPath);
}

// save vocabulary json file
fs.writeFileSync(vocPath, vocabularyJSON, 'binary', (err) => {
    if (err) {
        return console.log(err);
    }
});