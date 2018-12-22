const fs = require("fs");
const stopwords = require('stopwords-es');

// get dir files
const directory = "../wikipedia"
const files = fs.readdirSync(directory);

// create articles dir
const articlesDir = './logs/articles';
if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir);
}

// iterate files
let articleCont = 0;
const filesMax = files.length;
let fileCount = 0;
for (; fileCount < filesMax; fileCount++) {
    let fileName = files[fileCount];
    // read file
    const filePath = `${directory}/${fileName}`;
    const file = fs.readFileSync(filePath, 'binary');

    // remove tags, clean text & split in articles
    const articles = file
        .replace(/<[^>]*>/g, '')
        .replace(/[,]/g, '')
        .replace(/\s[.]|[.]\s/g, '.')
        .toLowerCase()
        .split('endofarticle.');

    // iterate articles
    const articlesMax = articles.length;
    let aa = 0;
    for (; aa < articlesMax; aa++) {
        let article = articles[aa];

        // increment article cont
        articleCont++;

        // create dir for each article
        const articleDir = `${articlesDir}/article_${articleCont}`;
        if (!fs.existsSync(articleDir)) {
            fs.mkdirSync(articleDir);
        }

        // create .txt for each article
        const articleName = `${articleDir}/article_${articleCont}.txt`;
        if (fs.existsSync(articleName)) {
            // remove .txt file if exists
            fs.unlinkSync(articleName);
        }

        // write new .txt file
        fs.writeFileSync(articleName, article, 'binary', (err) => {
            if (err) {
                return console.log(err);
            }
        });

        // split article in sentences
        const sentences = article
            .split('.')
            .map(sentence => {
                // extract words only
                const words = sentence.match(/[a-záéíóúñäëïöüâêîôûàèìòù]+/gi);
                if (words) {
                    return words
                        // remove stopwords
                        .filter(w => stopwords.indexOf(w) === -1)
                        // join into sentence
                        .join(' ');
                }
            })
            // remove invalid sentences
            .filter(s => !!s);

        // write sentences file
        const sentencesFileName = articleDir + '/sentences.txt';
        fs.writeFileSync(sentencesFileName, sentences, 'binary', (err) => {
            if (err) {
                return console.log(err);
            }
        });
    }

}
