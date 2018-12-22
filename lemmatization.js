// Lemmatization Spanish
const fs = require("fs");

// class Lemmatization {
// va
//     constructor() {
//         this.getDicc();
//     }

//     getDicc() {
//         let path = '../lemmatization/lemmatization-es.txt';
//         const lemm = fs.readdirSync(path);
//         console.log(lemm);        
//     }


// }

// module.exports = Lemmatization;


let path = '../lemmatization/lemmatization-es.txt';
const lemm = fs.readdirSync(path);
console.log(lemm);        