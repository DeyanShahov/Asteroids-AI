"use strict";
const LOG_ON = true;
const LOG_FREQUENSY = 20000;

export class NeuralNetworkV2 {
    constructor(numInputs, numHidden0, numHidden1, numOutputs) {
        this._inputs = [];
        this._hidden0 = [];
        this._hidden1 = [];

        this._numInputs = numInputs;
        this._numHidden0 = numHidden0;
        this._numHidden1 = numHidden1;
        this._numOutputs = numOutputs;

        this._bias0 = new Matrix(1, this._numHidden0);
        this._bias1 = new Matrix(1, this._numHidden1);
        this._bias2 = new Matrix(1, this._numOutputs);

        this._weights0 = new Matrix(this._numInputs, this._numHidden0);
        this._weights1 = new Matrix(this._numHidden0, this._numHidden1);
        this._weights2 = new Matrix(this._numHidden1, this._numOutputs);

        this._logCount = LOG_FREQUENSY;

        this._bias0.randomWeights();
        this._bias1.randomWeights();
        this._bias2.randomWeights();


        this._weights0.randomWeights();
        this._weights1.randomWeights();
        this._weights2.randomWeights();
    }

    feedForward(inputArray) {
        this._inputs = Matrix.convertFromArray(inputArray);

        this._hidden0 = Matrix.dot(this._inputs, this._weights0);
        this._hidden0 = Matrix.add(this._hidden0, this._bias0);
        this._hidden0 = Matrix.map(this._hidden0, x => sigmoid(x));

        this._hidden1 = Matrix.dot(this._hidden0, this._weights1);
        this._hidden1 = Matrix.add(this._hidden1, this._bias1);
        this._hidden1 = Matrix.map(this._hidden1, x => sigmoid(x));

        let outputs = Matrix.dot(this._hidden1, this._weights2);
        outputs = Matrix.add(outputs, this._bias2);
        outputs = Matrix.map(outputs, x => sigmoid(x));
        return outputs;
    }

    trein(inputArray, targetArray) {
        // feed the input data through the network
        let outputs = this.feedForward(inputArray);

        // calculate the output errors (traget - output)
        let targets = Matrix.convertFromArray(targetArray);
        let outputErrors = Matrix.subtract(targets, outputs);

        // error logging
        if (LOG_ON) {
            if (this._logCount == LOG_FREQUENSY) {
                console.log('error = ' + outputErrors.data[0][0]);
            }
            this._logCount--;
            if (this._logCount == 0) {
                this._logCount = LOG_FREQUENSY;
            }
        }

        // caluclate the deltas (errors * derivitive ot the output)
        let outputDerivs = Matrix.map(outputs, x => sigmoid(x, true));
        let outputDeltas = Matrix.multiply(outputErrors, outputDerivs);

        // calculate second hidden layer errors (deltas "dot" transpose of weights2)
        let weights2T = Matrix.transpose(this._weights2);
        let hidden2Errors = Matrix.dot(outputDeltas, weights2T);

        // calculate the second hidden layer deltas (errors * derivative of hidden2)
        let hidden2Derivs = Matrix.map(this._hidden1, x => sigmoid(x, true));
        let hidden2Deltas = Matrix.multiply(hidden2Errors, hidden2Derivs);

        // calculate hidden layer errors (deltas "dot" transpose of weights1)
        let weights1T = Matrix.transpose(this._weights1);
        let hidden1Errors = Matrix.dot(hidden2Deltas, weights1T);

        // calculate the hidden deltas (errors * derivitive of hidden)
        let hidden1Derivs = Matrix.map(this._hidden0, x => sigmoid(x, true));
        let hidden1Deltas = Matrix.multiply(hidden1Errors, hidden1Derivs);

        // update the weights (add transpose of layers "dot" deltas)
        let hidden2T = Matrix.transpose(this._hidden1);
        this._weights2 = Matrix.add(this._weights2, Matrix.dot(hidden2T, outputDeltas));
        let hidden1T = Matrix.transpose(this._hidden0);
        this._weights1 = Matrix.add(this._weights1, Matrix.dot(hidden1T, hidden2Deltas));
        let inputsT = Matrix.transpose(this._inputs);
        this._weights0 = Matrix.add(this._weights0, Matrix.dot(inputsT, hidden1Deltas));

        // update bias
        this._bias2 = Matrix.add(this._bias2, outputDeltas);
        this._bias1 = Matrix.add(this._bias1, hidden2Deltas);
        this._bias0 = Matrix.add(this._bias0, hidden1Deltas);
    }
}

function sigmoid(x, deriv = false) {
    if (deriv) {
        return x * (1 - x); // where x = sigmoid(x)
    }
    return 1 / (1 + Math.exp(-x));
}



//--------------------------------------------------------------


export class Matrix {
    constructor(rows, cols, data = []) {
        this._rows = rows;
        this._cols = cols;
        this._data = data;

        // initialise with zeroes if no data provided
        if (data == null || data.length == 0) {
            this._data = [];
            for (let i = 0; i < this._rows; i++) {
                this._data[i] = [];
                for (let j = 0; j < this._cols; j++) {
                    this._data[i][j] = 0;
                }
            }
        } else {
            // check data integrity
            if (data.length != rows || data[0].length != cols) {
                throw new Error('Incorrect data dimensions!');
            }
        }
    }

    get rows() {
        return this._rows;
    }

    get cols() {
        return this._cols;
    }

    get data() {
        return this._data;
    }

    // add two matrices
    static add(m0, m1) {
        Matrix.checkDimensions(m0, m1);
        let m = new Matrix(m0.rows, m0.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.data[i][j] = m0.data[i][j] + m1.data[i][j];
            }
        }
        return m;
    }

    // subtract two matrices
    static subtract(m0, m1) {
        Matrix.checkDimensions(m0, m1);
        let m = new Matrix(m0.rows, m0.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.data[i][j] = m0.data[i][j] - m1.data[i][j];
            }
        }
        return m;
    }

    // multiply two matrices
    static multiply(m0, m1) {
        Matrix.checkDimensions(m0, m1);
        let m = new Matrix(m0.rows, m0.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.data[i][j] = m0.data[i][j] * m1.data[i][j];
            }
        }
        return m;
    }

    // dot product of two matices
    static dot(m0, m1) {
        if (m0.cols != m1.rows) {
            throw new Error('Matrices are not \"dot\" compatible!');
        }
        let m = new Matrix(m0.rows, m1.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                let sum = 0;
                for (let k = 0; k < m0.cols; k++) {
                    sum += m0.data[i][k] * m1.data[k][j];
                }
                m.data[i][j] = sum;
            }
        }
        return m;
    }

    // apply a function (eventualy sigmoid function) to each cell of the given matrix
    static map(m0, mFunction) {
        let m = new Matrix(m0.rows, m0.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.data[i][j] = mFunction(m0.data[i][j]);
            }
        }
        return m;
    }

    // applay random weights between -1 and 1
    randomWeights() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    //------------------------------------------------------------------------------------------

    // check matices have the same dimensions
    static checkDimensions(m0, m1) {
        if (m0.rows != m1.rows || m0.cols != m1.cols) {
            throw new Error("Matices are of different dimensions!");
        }
    }

    // convert array to a one-rowed matrix
    static convertFromArray(arr) {
        return new Matrix(1, arr.length, [arr]);
    }

    // find the transpose of the given matrix
    static transpose(m0) {
        let m = new Matrix(m0.cols, m0.rows);
        for (let i = 0; i < m0.rows; i++) {
            for (let j = 0; j < m0.cols; j++) {
                m.data[j][i] = m0.data[i][j];
            }
        }
        return m;
    }
}


