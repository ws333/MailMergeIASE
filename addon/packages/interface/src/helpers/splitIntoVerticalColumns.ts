export function splitIntoVerticalColumns<T>(array: T[], columns: number): T[][] {
    const result: T[][] = Array.from({ length: columns }, () => []);
    const itemsPerColumn = Math.ceil(array.length / columns);
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row < itemsPerColumn; row++) {
            const idx = col * itemsPerColumn + row;
            if (idx < array.length) {
                result[col].push(array[idx]);
            }
        }
    }
    return result;
}
