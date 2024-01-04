export default class InvalidRangeError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'InvalidRangeError';
    }

    /**
     *
     */
    constructor() {
        super('The given range is invalid');
    }
}