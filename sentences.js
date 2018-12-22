const fs = require("fs");

const sentences = { total: 0, sentences: [] };
const articlesDir = './logs/articles';
const articles = fs.readdirSync(articlesDir);
articles.forEach(article => {
    const path = `${articlesDir}/${article}/sentences.txt`
    const sentencesFile = fs.readFileSync(path, 'binary');
    sentencesFile
        .split(',')
        .forEach(sentence => {
            sentences.total++;
            sentences.sentences.push({
                value: sentence,
                article: article
            });
        });
});

const sentencesDir = './logs/sentences';
if (!fs.existsSync(sentencesDir)) {
    fs.mkdirSync(sentencesDir);
}

const sentencesJsonFile = `${sentencesDir}/sentences.json`;
if (fs.existsSync(sentencesJsonFile)) {
    fs.unlinkSync(sentencesJsonFile);
}

const sentencesJSON = JSON.stringify(sentences);
fs.writeFileSync(sentencesJsonFile, sentencesJSON, 'binary', (err) => {
    if (err) {
        return console.log(err);
    }
});