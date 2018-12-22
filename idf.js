const fs = require("fs");
const { performance } = require('perf_hooks');

const init = performance.now();

const vocabularyDir = './logs/vocabulary';
const articlesDir = './logs/articles';
const articles = fs.readdirSync(articlesDir);
const wordsMapPath = `${vocabularyDir}/wordsmap.json`
const wordsMapJSON = fs.readFileSync(wordsMapPath, 'binary');
const wordsMap = JSON.parse(wordsMapJSON);
const words = Object.keys(wordsMap);
const wordMax = words.length;
const articleMax = articles.length;

let wordCount = 0;
console.log(wordMax);

for (; wordCount < wordMax; wordCount++) {
    let word = words[wordCount];
    let wordObj = wordsMap[word];
    let articleCount = 0;
    let ocurrences = 0;
    for (; articleCount < articleMax; articleCount++) {
        let articleFolder = articles[articleCount];
        let artPath = `${articlesDir}/${articleFolder}/${articleFolder}.txt`
        let article = fs.readFileSync(artPath, 'binary');
        let isInArticle = (article.match(new RegExp('\\b' + word + '\\b', 'g')) || []).length > 0;
        if (isInArticle) {
            ocurrences++;
        }
    }
    let idf = article / ocurrences;
    wordObj['idf'] = idf;
    wordsMap[words[wordCount]] = wordObj;
    console.log(wordCount);
}

const finished = performance.now();
const timeSpent = (finished - init) / 60000;
console.log('idf finished in ' + timeSpent + ' minutes.');

let path = `${vocabularyDir}/wordsmap_idf.json`
if (fs.existsSync(path)) {
    fs.unlinkSync(path);
}

const jsonString = JSON.stringify(wordsMap);
fs.writeFileSync(path, jsonString, 'binary', (err) => {
    if (err) {
        return console.log(err);
    }
});
