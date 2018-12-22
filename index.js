const fs = require("fs");
const directory = "../wikipedia"
const stopwords = require('stopwords-es');

// make one big text
console.log('Joining texts');
let text = '';
let fileNames = fs.readdirSync(directory);
fileNames.forEach(fileName => {
    let file = fs.readFileSync(directory + '/' + fileName, 'binary');
    text += ' ' + file;
});

// extract words only
console.log('Extracting words');
const splitted = text.match(/[a-záéíóúñäëïöüâêîôûàèìòù]+/gi);

// create vocabulary
console.log('Creating vocabulary');
const wordVoc = {};
splitted.forEach(word => {
    word = word.toLowerCase(); // make all words lowercase
    if (wordVoc.hasOwnProperty(word)) {
        wordVoc[word] = wordVoc[word] + 1;
        return;
    }
    wordVoc[word] = 1;
});

// remove stopwords
console.log('Removing stopwords');
const keys = Object.keys(wordVoc);
keys.forEach(word => {
    if (stopwords.indexOf(word) > -1) {
        delete wordVoc[word];
    }
});

// sort by number of occurrences
console.log('Sorting...');
const wordKeys = Object.keys(wordVoc);
const items = wordKeys.map(key => [key, wordVoc[key]]);
const sortedItems = items.sort((first, second) => second[1] - first[1]);

// delete vocabulary file if exists
if (fs.existsSync('./logs/vocabulary.txt')) {
    console.log('vocabulary.txt found');
    fs.unlinkSync('./logs/vocabulary.txt');
    console.log('vocabulary.txt deleted');
}

// save vocabulary file
console.log('Creating vocabulary.txt');
const firstLine = 'Total words: ' + wordKeys.length;
fs.writeFileSync('./logs/vocabulary.txt', firstLine, 'binary', (err) => {
    if (err) {
        return console.log(err);
    }
});
console.log(firstLine);

sortedItems.forEach(item => {
    let vocLine = "\r\nword: " + item[0] + " - cont: " + item[1];
    fs.appendFileSync('./logs/vocabulary.txt', vocLine, 'binary', (err) => {
        if (err) {
            return console.log(err);
        }
    });
});
console.log('Finished!');






