
class Matrix {

    constructor(rows, cols, initializer) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = [];

        let r = 0;
        for (; r < this.rows; r++) {
            this.matrix[r] = [];
            let c = 0;
            for (; c < this.cols; c++) {
                this.matrix[r][c] = 0;
            }
        }
    }

}

Matrix.prototype.add = function (n) {
    const rc = row.length,
        cc = cols.length;
    let r = 0,
        c = 0;
    for (; r < rc; r++) {
        for (; c < cc; c++) {
            this.matrix[r][c] += n;
        }
    }
}

Matrix.prototype.subtract = function (n) {
    const rc = row.length,
        cc = cols.length;
    let r = 0,
        c = 0;
    for (; r < rc; r++) {
        for (; c < cc; c++) {
            this.matrix[r][c] -= n;
        }
    }
}

Matrix.prototype.multiply = function (n) {
    const rc = row.length,
        cc = cols.length;
    let r = 0,
        c = 0;
    for (; r < rc; r++) {
        for (; c < cc; c++) {
            this.matrix[r][c] *= n;
        }
    }
}

Matrix.prototype.divide = function (n) {
    const rc = row.length,
        cc = cols.length;
    let r = 0,
        c = 0;
    for (; r < rc; r++) {
        for (; c < cc; c++) {
            this.matrix[r][c] /= n;
        }
    }
}

Matrix.prototype.map = function (fn) {
    const rc = row.length,
        cc = cols.length;
    let r = 0,
        c = 0;
    for (; r < rc; r++) {
        for (; c < cc; c++) {
            this.matrix[r][c] = fn(this.matrix[r][c]);
        }
    }
}

module.exports = Matrix;