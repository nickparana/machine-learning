const fs = require("fs");
const es = require('event-stream');
const JSONStream = require("JSONStream");
const { performance } = require('perf_hooks');

// calculate TF(t) = (Number of times term t appears in a article) / (Total number of terms in the article).
// calculate IDF(t) = log_e(Total number of documents / Number of documents with term t in it).
const init = performance.now();

const vocabularyDir = './logs/vocabulary';
const articlesDir = './logs/articles';
const vocabularyPath = vocabularyDir + '/vocabulary.json';
const vocabularyJson = fs.readFileSync(vocabularyPath, 'binary');
const vocabulary = JSON.parse(vocabularyJson);
const articles = fs.readdirSync(articlesDir);

const wordsMap = {};
let wordCount = 0; const wordMax = vocabulary.words.length;
for (; wordCount < wordMax; wordCount++) {
    let w = vocabulary.words[wordCount];
    wordsMap[w.value] = { count: w.count, tf: {}, idf: { ocurrences: 0 }, tfidf: {} };
}
let articleCount = 0; const articleMax = articles.length;
for (; articleCount < articleMax; articleCount++) {
    let articleFolder = articles[articleCount];
    let sentencesPath = `${articlesDir}/${articleFolder}/sentences.txt`;
    const sentencesFile = fs.readFileSync(sentencesPath, 'binary');
    const joinedWords = sentencesFile.replace(/[,]/g, ' ');
    const splittedWords = joinedWords.split(' ');

    let splittedCount = 0; const splittedMax = splittedWords.length;
    for (; splittedCount < splittedMax; splittedCount++) {
        let word = splittedWords[splittedCount];
        const totalOccurrences = (joinedWords.match(new RegExp(word, 'g')) || []).length;
        if (totalOccurrences > 0) {
            const tf = totalOccurrences / splittedWords.length;
            wordsMap[word]['tf'][articleFolder] = tf;
        }

        // for idf
        wordsMap[word]['idf']['ocurrences'] += 1;
        wordsMap[word]['idf']['value'] = Math.log(articleMax / wordsMap[word]['idf']['ocurrences']);
        wordsMap[word]['tfidf'][articleFolder] = wordsMap[word]['tf'][articleFolder] * wordsMap[word]['idf']['value'];
    }
    console.log(articleCount);
}

const finished = performance.now();
const timeSpent = (finished - init) / 60000;
console.log('tf finished in ' + timeSpent + ' minutes.');

let wordsMapPath = `${vocabularyDir}/wordsmap.json`
if (fs.existsSync(wordsMapPath)) {
    fs.unlinkSync(wordsMapPath);
}

let out = fs.createWriteStream(wordsMapPath);
es.readable(function (count, next) {
    for (let key in wordsMap) {
        this.emit('data', [key, wordsMap[key]]);
    }   
    next();
}).pipe(JSONStream.stringifyObject()).pipe(out);


