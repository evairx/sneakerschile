export function validateNumber(input: number): string {
    if (typeof input !== 'number' || isNaN(input)) {
        throw new TypeError('Input must be a number');
    }
    if (!Number.isInteger(input)) {
        throw new TypeError('Number cannot be decimal, it must be an integer');
    }
    if (input < 350) {
        throw new RangeError('Input must be 350 or greater');
    }
    
    return input.toString();
}