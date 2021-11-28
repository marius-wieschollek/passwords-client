export default class InvalidScopeError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'InvalidScopeError';
    }

    /**
     * @param {String} scope
     */
    constructor(scope) {
        super(`Invalid scope ${scope}`);
    }
}