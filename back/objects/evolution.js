const Gene = require('./gene.js');

class Evolution {

    size;
    epoch;
    population;
    epochSolutions;
    allSolutions;

    constructor(populationSize, geneSize) {
        this.epoch = 0;
        this.size = populationSize;
        this.population = this.initPopulation(geneSize);
        this.allSolutions = [];
        this.epochSolutions = [];
    }

    initPopulation(geneSize) {
        let pop = [];
        for (let i = 0; i < this.size; i++) {
            pop.push(new Gene(geneSize));
        }
        return pop;
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
        if (this.getAllSolutions().filter(s => s === solution).length === 0) {
            this.epochSolutions.push(solution);
            this.allSolutions.push(solution);
        }
    }

    newEpoch() {
        this.epochSolutions = [];
        this.epoch += 1;
    }

    calculateFitness() {
        this.population.forEach(g => g.calculateFitness());
        // For my kind of fitness the higher the worse it is.
        let maximum = Math.max(...this.population.map(g => g.getIndividualFitness()));
        let minimum = Math.min(...this.population.map(g => g.getIndividualFitness()));
        console.log({maximum, minimum});
        this.population.forEach(g => {
            if (g.getIndividualFitness() === 0) {
                this.addSolution(g.getInstructions());
            }
        });
    }
}
module.exports = Evolution;
