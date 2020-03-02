export class ArrayHelper {
    public static choose(arr: any[]): any {
        if (!arr) { return; }
        return arr[Math.floor(Math.random() * arr.length)];
    }

    public static randomIndex(arr: any[]): number {
        if (!arr) { return -1; }
        return Math.floor(Math.random() * (arr.length-1));
    }

    public static swapTwoElements(arr: any[]): any[] {
        const firstElementIndex: number = ArrayHelper.randomIndex(arr);
        const secondElementIndex: number = ArrayHelper.randomIndex(arr);
        let temp = arr[firstElementIndex];
        arr[firstElementIndex] = arr[secondElementIndex];
        arr[secondElementIndex] = temp;
        return arr;
    }
}
