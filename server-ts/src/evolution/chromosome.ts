export class Chromosome {

    private _size: number;
    private _isSolution: boolean;
    private _instructions: number[];
    private _numberOfCollisions: number;
    private _fitness: number;

    constructor(chromosomeSize: number, instructions: number[]=null) {
        this.size = chromosomeSize;
        this.isSolution = false;
        this.instructions = instructions || Chromosome.initInstructions(chromosomeSize);
        this.shuffleInstructions();
    }

    private get size(): number { return this._size; }
    private set size(size: number) { this._size = size; }

    public get isSolution(): boolean { return this._isSolution; }
    public set isSolution(isSolution: boolean) { this._isSolution = isSolution; }

    public get instructions(): number[] { return this._instructions; }
    public set instructions(instructions: number[]) { this._instructions = instructions; }

    public get numberOfCollisions(): number { return this._numberOfCollisions; }
    public set numberOfCollisions(numberOfCollisions: number) { this._numberOfCollisions = numberOfCollisions; }

    public get fitness(): number { return this._fitness; }
    public set fitness(fitness: number) { this._fitness = fitness; }

    private shuffleInstructions(): void {
        for (let i = this.size - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.instructions[i], this.instructions[j]] = [this.instructions[j], this.instructions[i]];
        }
    }

    private static initInstructions(chromosomeSize: number): number[] {
        return Array<number>(chromosomeSize)
                .fill(null)
                .map((v, index) => index);
    }

    public calculateCollisions(): void {
        let numberOfCollisions = 0;
        for (let i = 0; i < this.size; i++) {
            let diagonalUp = this.instructions[i] + 1;
            let diagonalDown = this.instructions[i] - 1;
            for (let j = i+1; j < this.size; j++) {
                if (this.instructions[j] === diagonalUp) {
                    numberOfCollisions += 1;
                } else if (this.instructions[j] === diagonalDown) {
                    numberOfCollisions += 1;
                }
                diagonalUp += 1;
                diagonalDown -= 1;
            }
        }
        if (numberOfCollisions === 0) { this.isSolution = true; }
        this.numberOfCollisions = numberOfCollisions;
    }

    public calculateFitness(maxCollisions: number): void {
        this.fitness = (maxCollisions - this.numberOfCollisions) / maxCollisions;
    }
}
