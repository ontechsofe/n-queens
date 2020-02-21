module.exports = class Gene {

    size;
    code;
    scaledFitness;
    numMistakes;

    constructor(size) {
        this.size = size;
        this.code = this.initGene();
        this.numMistakes = size;
    }

    getInstructions() {
        return this.code;
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    initGene() {
        return this.shuffle(Array.from({length: this.size}, (v, i) => i));
    }

    getNumMistakes() {
        return this.numMistakes;
    }

    getScaledFitness() {
        return this.scaledFitness;
    }

    setScaledFitness(fitness) {
        this.scaledFitness = fitness;
    }

    calculateMistakes() {
        // 0 is a solution. Higher fitness is worse.
        let fitness = 0;
        for (let i = 0; i < this.size; i++) {
            let diagonalUp = this.getInstructions()[i] + 1;
            let diagonalDown = this.getInstructions()[i] - 1;
            for (let j = i+1; j < this.size; j++) {
                if (this.getInstructions()[j] === diagonalUp) {
                    fitness += 1;
                } else if (this.getInstructions()[j] === diagonalDown) {
                    fitness += 1;
                }
                diagonalUp += 1;
                diagonalDown -= 1;
            }
        }
        this.numMistakes = fitness;
    }
};
