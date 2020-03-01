import {EpochData} from 'epoch-data';
import {Population} from './population';

export class Nature {

    epoch: number;
    populationSize: number;
    chromosomeSize: number;
    population: Population;

    constructor(populationSize: number, chromosomeSize: number) {
        this.populationSize = populationSize;
        this.chromosomeSize = chromosomeSize;
        this.epoch = 0;
        this.population = new Population(populationSize, chromosomeSize);
    }

    public run(): void {
        this.population.epochSolutions = [];
        this.population.calculateFitness();
        this.population.naturalSelection();
        this.population.crossover();
    }

    public getEpochData(): EpochData {
        return {
            epochId: this.epoch++,
            population: this.population.instructionSet,
            solutions: this.population.epochSolutions
        };
    }
}