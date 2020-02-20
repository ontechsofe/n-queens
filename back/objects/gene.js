module.exports = class Gene {

    size;
    code;

    constructor(size) {
        this.size = size;
        this.code = this.initGene();
    }

    getInstructions() {
        return this.code;
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    initGene() {
        let shuffled = this.shuffle(Array.from({length: this.size}, (v, i) => i));

        return new Set(shuffled);
    }
};
