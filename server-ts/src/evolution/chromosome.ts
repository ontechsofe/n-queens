export class Chromosome {

    size: number;
    instructions: number[];

    constructor(chromosomeSize: number) {
        this.size = chromosomeSize;
        this.initInstructions(chromosomeSize);
        this.shuffleInstructions();
    }

    private shuffleInstructions(): void {
        for (let i = this.instructions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.instructions[i], this.instructions[j]] = [this.instructions[j], this.instructions[i]];
        }
    }

    private initInstructions(chromosomeSize: number): void {
        this.instructions = Array<number>(chromosomeSize)
                                .fill(null)
                                .map((v, index) => index);
    }
}