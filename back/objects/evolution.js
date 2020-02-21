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
        // console.log(this.getAllSolutions().map(s => s.join()));
        if (!this.getAllSolutions().map(s => s.join('')).includes(solution.join(''))) {
            this.epochSolutions.push(solution);
            this.allSolutions.push(solution);
        }
    }

    calculateFitness() {
        this.population.forEach(g => g.calculateMistakes());
        // The more mistakes the worse it is.
        let maximum = Math.max(...this.population.map(g => g.getNumMistakes()));
        let minimum = Math.min(...this.population.map(g => g.getNumMistakes()));
        // console.log({maximum, minimum});
        this.population.forEach(g => {
            if (g.getNumMistakes() === 0) {
                this.addSolution(g.getInstructions());
                g.setScaledFitness(1);
                minimum = 0.5;
            } else {
                let fitness = (maximum - g.getNumMistakes()) / maximum;
                g.setScaledFitness(fitness);
            }
        });
    }

    naturalSelection() {
        this.population.forEach((g, index) => {
           let chance = Math.random();
           if (g.getScaledFitness() > chance) {
               this.population.splice(index, 1);
           }
        });
    }

    makeBabies() {

    }

    crossOver() {

    }

    mutation() {

    }

    newEpoch() {
        this.epochSolutions = [];
        this.initPopulation();
        this.calculateFitness();
        // TODO: Create below items
        // this.naturalSelection(); // WORKING
        // this.makeBabies();
        // this.mutation();
    }
}
module.exports = Evolution;
