export default class InvalidObjectTypeError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'InvalidObjectTypeError';
    }

    /**
     * @param {String} type
     */
    constructor(type) {
        super(`Invalid Object Type "${type}"`);
    }
}