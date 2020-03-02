import {EpochData} from 'epoch-data';
import {Population} from './population';

export class Nature {

    epoch: number;
    population: Population;

    constructor(populationSize: number, chromosomeSize: number) {
        this.epoch = 0;
        this.population = new Population(populationSize, chromosomeSize);
    }

    public run(): void {
        this.population.reset();
        this.population.calculateFitness();
        this.population.naturalSelection();
        this.population.breeding();
        this.population.mutation();
    }

    public getEpochData(): EpochData {
        return {
            epochId: this.epoch++,
            population: this.population.instructionSet,
            solutions: this.population.epochSolutions
        };
    }
}
