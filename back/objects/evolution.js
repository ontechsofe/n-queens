const Gene = require('./gene.js');

class Evolution {

    size;
    geneSize;
    epoch;
    population;
    epochSolutions;
    allSolutions;

    constructor(populationSize, geneSize) {
        this.epoch = 0;
        this.size = populationSize;
        this.geneSize = geneSize;
        this.initPopulation();
        this.allSolutions = [];
        this.epochSolutions = [];
    }

    initPopulation() {
        this.population = [];
        for (let i = 0; i < this.size; i++) {
            this.population.push(new Gene(this.geneSize));
        }
    }

    getEpoch() {
        return this.epoch;
    }

    getPopulation() {
        return this.population;
    }

    getGeneCodes() {
        return this.population.map(g => g.getInstructions());
    }

    getAllSolutions() {
        return this.allSolutions;
    }

    getEpochSolutions() {
        return this.epochSolutions;
    }

    addSolution(solution) {
        if (!this.getAllSolutions().map(s => s.join('')).includes(solution.join(''))) {
            this.epochSolutions.push(solution);
            this.allSolutions.push(solution);
        }
    }

    calculateFitness() {
        this.population.forEach(g => g.calculateMistakes());
        // The more mistakes the worse it is.
        let maximum = Math.max(...this.population.map(g => g.getNumMistakes()));
        this.population.forEach(g => {
            if (g.getNumMistakes() === 0) {
                this.addSolution(g.getInstructions());
                g.setScaledFitness(0.5);
            } else {
                let fitness = (maximum - g.getNumMistakes()) / (maximum * 1.5);
                g.setScaledFitness(fitness);
            }
        });
    }

    randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    naturalSelection() {
        this.population = this.population.filter(g => g.getScaledFitness() > Math.random());
    }

    makeBabies() {
        let survivors = this.population.length;
        while (this.population.length < this.size) {
            let mommy = this.population[this.randomInteger(0, survivors - 1)];
            let daddy = this.population[this.randomInteger(0, survivors - 1)];
            let babies = this.crossOver(mommy, daddy);

            this.population.push(babies[0]);
            this.population.push(babies[1]);
        }
        if (this.population.length > this.size) {
            this.population.pop();
        }
    }

    crossOver(mommy, daddy) {
        mommy = mommy ? mommy : new Gene(this.geneSize);
        daddy = daddy ? daddy : new Gene(this.geneSize);
        const momInstructions = mommy.getInstructions().slice();
        const dadInstructions = daddy.getInstructions().slice();
        const splicePoint = this.randomInteger(0, this.geneSize - 1);
        let rightSliceMommy = momInstructions.slice(splicePoint);
        let rightSliceDaddy = dadInstructions.slice(splicePoint);
        const babies = [];
        let kid0 = momInstructions.filter(pos => !rightSliceMommy.includes(pos)).concat(rightSliceMommy);
        let kid1 = dadInstructions.filter(pos => !rightSliceDaddy.includes(pos)).concat(rightSliceDaddy);
        babies.push(new Gene(this.geneSize, kid0));
        babies.push(new Gene(this.geneSize, kid1));
        return babies;
    }

    mutation() {
        const mutationRate = 1;
        this.population.forEach(g => {
            if (g.getNumMistakes() !== 0 && mutationRate > Math.random()) {
                g.setInstructions(this.swapTwo(g.getInstructions()));
            }
        });
    }

    swapTwo(arr) {
        let num0 = this.randomInteger(0, arr.length - 1);
        let num1 = this.randomInteger(0, arr.length - 1);
        while (num0 === num1) {
            num0 = this.randomInteger(0, arr.length - 1);
            num1 = this.randomInteger(0, arr.length - 1);
        }
        arr[num0] = arr[num0] + arr[num1];
        arr[num1] = arr[num0] - arr[num1];
        arr[num0] = arr[num0] - arr[num1];
        return arr;
    }

    newEpoch() {
        this.epochSolutions = [];
        // this.initPopulation();
        this.calculateFitness();
        this.naturalSelection();
        this.makeBabies();
        this.mutation();
    }
}
module.exports = Evolution;
