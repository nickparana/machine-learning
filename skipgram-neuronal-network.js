const math = require('mathjs');

class NeuronalNetwork {

    constructor(inputLayerSize, hiddenLayerSize, outputLayerSize, learningRate, epoch) {
        this.inputLayerSize = inputLayerSize;
        this.hiddenLayerSize = hiddenLayerSize;
        this.outputLayerSize = outputLayerSize;
        this.learningRate = learningRate;
        this.epoch = epoch;
    }

    forward(input) {
        this.X = input;
        this.W1 = this.W1 || this.randomMatrix(this.inputLayerSize, this.hiddenLayerSize);
        this.W2 = this.W2 || this.randomMatrix(this.hiddenLayerSize, this.outputLayerSize);

        this.H = math.multiply(math.transpose(this.W1), this.X);
        this.U = math.multiply(math.transpose(this.W2), this.H);
        this.Y = this.softmax(this.U._data);
    }

    train(data) {

        this.W1 = this.W1 || this.randomMatrix(this.inputLayerSize, this.hiddenLayerSize);
        this.W2 = this.W2 || this.randomMatrix(this.hiddenLayerSize, this.outputLayerSize);

        const maxData = data.length;
        for (let i = 0; i < this.epoch; i++) {
            let d = 0;
            for (; d < maxData; d++) {
                let input = math.matrix(data[d].input, 'dense');                
                //let output = math.matrix(data[d].target, 'dense');

                let outputs = data[d].target;              
                
                this.forward(input);

                let error = math.zeros(this.outputLayerSize);
                outputs.forEach(output => {
                    error = math.add(math.subtract(this.Y, output), error);
                });

                let sumErrorT = math.matrix([error._data]);
                let dLw2 = math.multiply(math.matrix(this.H._data.map(e => [e])), sumErrorT);
                let dLw1 = math.multiply(math.matrix(this.X._data.map(e => [e])), math.transpose(math.matrix(math.multiply(this.W2, error)._data.map(e => [e]))));
                this.W1 = math.subtract(this.W1, math.multiply(this.learningRate, dLw1));
                this.W2 = math.subtract(this.W2, math.multiply(this.learningRate, dLw2));
            }
        }
    }

    xMean(inputs) {
        return math.mean(inputs, 0);
    }

    guess(input) {
        this.forward(math.matrix(input, 'dense'));
        let output = this.Y._data;
        return math.round(output, 5);
    }

    softmax(arr) {
        return math.matrix(arr.map(x => math.exp(x) / (arr.map(y => math.exp(y))).reduce((a, b) => a + b)), 'dense');
    }

    randomMatrix(n, m) {
        return math.matrix(math.random([n, m]));
    }

}

module.exports = NeuronalNetwork;