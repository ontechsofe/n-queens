import {Chromosome} from './chromosome';

export class Population {

    chromosomes: Chromosome[];
    size: number;

    constructor(populationSize: number, chromosomeSize: number) {
        this.size = populationSize;
        this.initPopulation(populationSize, chromosomeSize);
    }

    private initPopulation(populationSize: number, chromosomeSize: number): void {
        this.chromosomes = Array<Chromosome>(populationSize)
                            .fill(null)
                            .map(() => new Chromosome(chromosomeSize));
    }

}