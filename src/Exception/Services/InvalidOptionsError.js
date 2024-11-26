export default class InvalidOptionsError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'InvalidOptionsError';
    }

    /**
     *
     */
    constructor(property) {
        super(`Invalid value for preview ${property}`);
    }
}