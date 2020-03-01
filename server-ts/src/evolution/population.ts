import {Chromosome} from './chromosome';

export class Population {

    chromosomes: Chromosome[];
    private _size: number;
    private _chromosomeSize: number;
    private _solutions: number[][];
    private _epochSolutions: number[][];

    constructor(populationSize: number, chromosomeSize: number) {
        this.size = populationSize;
        this.chromosomeSize = chromosomeSize;
        this.initPopulation(populationSize, chromosomeSize);
        this.solutions = [];
    }

    private set size(size: number) { this._size = size; }

    private get chromosomeSize(): number { return this._chromosomeSize; }
    private set chromosomeSize(chromosomeSize: number) { this._chromosomeSize = chromosomeSize; }

    public get instructionSet(): number[][] { return this.chromosomes.map(chromosome => chromosome.instructions); }

    public get solutions(): number[][] { return this._solutions; }
    public set solutions(solutions: number[][]) { this._solutions = solutions; }

    public get epochSolutions(): number[][] { return this._epochSolutions; }
    public set epochSolutions(epochSolutions: number[][]) { this._epochSolutions = epochSolutions; }

    private initPopulation(populationSize: number, chromosomeSize: number): void {
        this.chromosomes = Array<Chromosome>(populationSize)
                            .fill(null)
                            .map(() => new Chromosome(chromosomeSize));
    }

    private addSolution(solution: number[]): void {
        if (!this.solutions.map(s => s.join('')).includes(solution.join(''))) {
            this.epochSolutions.push(solution.slice());
            this.solutions.push(solution.slice());

            // Horizontal Flip
            this.addSolution(solution.map(pos => this.chromosomeSize - pos - 1));
            // Vertical Flip
            this.addSolution(solution.reverse());
            // Horizontal Flip again
            this.addSolution(solution.map(pos => this.chromosomeSize - pos - 1));
            // Vertical Flip again
            this.addSolution(solution.reverse());
        }
    }

    public calculateFitness(): void {
        this.chromosomes.forEach(chromosome => chromosome.calculateCollisions());
        const maxCollisions: number = Math.max(...this.chromosomes.map(chromosome => chromosome.numberOfCollisions));
        this.chromosomes.forEach(chromosome => {
            if (chromosome.isSolution) { this.addSolution(chromosome.instructions); }
            chromosome.calculateFitness(maxCollisions);
        });
    }

    public naturalSelection(): void {
        this.chromosomes = this.chromosomes.filter(chromosome => chromosome.fitness > Math.random());
    }

    public crossover(): void {
    }
}