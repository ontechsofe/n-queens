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

    public getEpochData(): EpochData {
        return {
            epochId: this.epoch++,
            population: [],
            solutions: []
        };
    }
}