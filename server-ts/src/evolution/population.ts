import {Chromosome} from './chromosome';
import {ArrayHelper} from './array-helper';

export class Population {

    chromosomes: Chromosome[];
    private _size: number;
    private _chromosomeSize: number;
    private _mutationRate: number;
    private _solutions: number[][];
    private _epochSolutions: number[][];

    constructor(populationSize: number, chromosomeSize: number) {
        this.size = populationSize;
        this.chromosomeSize = chromosomeSize;
        this.mutationRate = 0.05;
        this.initPopulation(populationSize, chromosomeSize);
        this.solutions = [];
    }

    private get size(): number {return this._size; }
    private set size(size: number) { this._size = size; }

    private get chromosomeSize(): number { return this._chromosomeSize; }
    private set chromosomeSize(chromosomeSize: number) { this._chromosomeSize = chromosomeSize; }

    private get mutationRate(): number { return this._mutationRate; }
    private set mutationRate(mutationRate: number) { this._mutationRate = mutationRate; }

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

    public reset(): void {
        this.epochSolutions = [];
        this.chromosomes.forEach(chromosome => chromosome.isSolution = false);
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

    public breeding(): void {
        let mommy: Chromosome, daddy: Chromosome;
        let babies: [Chromosome, Chromosome];
        while (this.chromosomes.length < this.size) {
            mommy = ArrayHelper.choose(this.chromosomes);
            daddy = ArrayHelper.choose(this.chromosomes);
            babies = this.crossover(mommy, daddy);

            this.chromosomes.push(babies[0]);
            this.chromosomes.push(babies[1]);
        }
        if (this.chromosomes.length > this.size) {
            this.chromosomes.pop();
        }
    }

    private crossover(mommy: Chromosome, daddy: Chromosome): [Chromosome, Chromosome] {
        mommy = mommy ? mommy : new Chromosome(this.chromosomeSize);
        daddy = daddy ? daddy : new Chromosome(this.chromosomeSize);
        const momInstructions = mommy.instructions.slice();
        const dadInstructions = daddy.instructions.slice();
        const splicePoint = ArrayHelper.randomIndex(mommy.instructions);
        const rightSliceMommy = momInstructions.slice(splicePoint);
        const rightSliceDaddy = dadInstructions.slice(splicePoint);
        const oldest = momInstructions.filter(pos => !rightSliceMommy.includes(pos)).concat(rightSliceMommy);
        const youngest = dadInstructions.filter(pos => !rightSliceDaddy.includes(pos)).concat(rightSliceDaddy);
        return [new Chromosome(this.chromosomeSize, oldest), new Chromosome(this.chromosomeSize, youngest)]
    }

    public mutation(): void {
        this.chromosomes.forEach(chromosome => {
            if (this.mutationRate > Math.random()) {
                ArrayHelper.swapTwoElements(chromosome.instructions);
            }
        });
    }
}
