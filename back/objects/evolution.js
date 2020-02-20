const Gene = require('./gene.js');

class Evolution {

    size;
    epoch;
    population;

    constructor(populationSize, geneSize) {
        this.epoch = 0;
        this.size = populationSize;
        this.population = this.initPopulation(geneSize);
    }

    getEpoch() {
        return this.epoch;
    }

    getPopulation() {
        return this.population;
    }

    getGeneCodes() {
        return this.population.map(g => [...g.getInstructions()]);
    }

    newEpoch() {
        this.epoch += 1;
    }

    initPopulation(geneSize) {
        let pop = [];
        for (let i = 0; i < this.size; i++) {
            pop.push(new Gene(geneSize));
        }
        return pop;
    }
}
module.exports = Evolution;
