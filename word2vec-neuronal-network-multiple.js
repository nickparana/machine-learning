const math = require('mathjs');

class NeuronalNetwork {

    constructor(inputLayerSize, hiddenLayerSize, outputLayerSize, learningRate, batchSize) {
        this.inputLayerSize = inputLayerSize;
        this.hiddenLayerSize = hiddenLayerSize;
        this.outputLayerSize = outputLayerSize;
        this.learningRate = learningRate;
        this.batchSize = batchSize;
        this.batchCont = 0;
    }

    forward(input) {
        this.X = input;
        this.W1 = this.W1 || this.randomMatrix(this.inputLayerSize, this.hiddenLayerSize);
        this.W2 = this.W2 || this.randomMatrix(this.hiddenLayerSize, this.outputLayerSize);

        this.H = math.multiply(math.transpose(this.W1), this.X);
        this.U = math.multiply(math.transpose(this.W2), this.H);
        this.Y = this.softmax(this.U._values);
    }

    train(data) {
        let input = math.matrix(data.input, 'sparse');
        let output = math.matrix(data.target, 'sparse');
        this.forward(input)
        let error = math.subtract(this.Y, output);
        let dLw2 = math.multiply(this.H, math.transpose(error));
        let dLw1 = math.multiply(this.X, math.transpose(math.multiply(this.W2, error)));

        for (let i = 0; i < 30; i++) {
            this.W1 = math.subtract(this.W1, dLw1);
            this.W2 = math.subtract(this.W2, dLw2);
        }        
    }

    guess(input) {
        this.forward( math.matrix(input, 'sparse'));
        let output = this.Y._values;
        return output;
    }

    softmax(arr) {
        return math.matrix(arr.map(x => math.exp(x) / (arr.map(y => math.exp(y))).reduce((a, b) => a + b)), 'sparse');
    }

    randomMatrix(n, m) {
        return math.matrix(math.random([n, m]));
    }



    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }


    // train(samples) {
    //     const batches = [];
    //     const numBatches = Math.floor(samples.length / this.batchSize);
    //     for (let i = 0; i < samples.length; i++) {
    //         let from = i * (samples.length / numBatches);
    //         let to = (i + 1) * (samples.length / numBatches);
    //         let batch = samples.slice(from, to);
    //         batches.push(batch);
    //     }

    //     batches.forEach(batch => {
    //         this.batchCont++;
    //         batch.forEach(sample => {
    //             this.forward(sample.inputs);

    //             this.update();
    //         });
    //     });
    // }

    // update() {
    //     // let deltaW1, deltaB1, deltaW2, deltaB2;

    //     // deltaW2 = math.dotMultiply(this.learningRate, this.dEdW2());
    //     // this.W2 = math.subtract(this.W2, deltaW2);

    //     // deltaW1 = math.dotMultiply(this.learningRate, this.dEdW1());
    //     // this.W1 = math.subtract(this.W1, deltaW1);

    //     let E = math.subtract(this.A3)
    // }

    // sigmoid(z) {
    //     return 1 / (1 + Math.exp(-z));
    // }

    // activate(e) {
    //     return this.sigmoid(e);
    // }

    // activateMatrix(m) {
    //     return m.map(elem => this.activate(elem));
    // }

    // sigmoidPrime(z) {
    //     return this.sigmoid(z) * (1 - this.sigmoid(z));
    // }

    // sigmoidPrimeMatrix(m) {
    //     return m.map(elem => this.sigmoidPrime(elem));
    // }

    // randomMatrix(n, m) {
    //     return math.matrix(math.random([n, m]));
    // }

    // calcDeltaK(target) {
    //     this.deltaK = math.dotMultiply(math.subtract(this.A3, target), this.sigmoidPrimeMatrix(this.Z3));
    // }

    // calcDeltaJ() {
    //     this.deltaJ = math.dotMultiply(math.multiply(math.transpose(this.W2), this.deltaK), this.sigmoidPrimeMatrix(this.Z2));
    // }

    // dEdW2() {
    //     return math.multiply(this.deltaK, math.transpose(this.A2));
    // }

    // dEdB2() {
    //     return this.deltaK;
    // }

    // dEdW1() {
    //     return math.multiply(this.deltaJ, math.transpose(this.X));
    // }

    // dEdB1() {
    //     return this.deltaJ;
    // }


    // guess(inputs) {
    //     this.forward(inputs);
    //     return this.A3._data;
    // }


}

module.exports = NeuronalNetwork;