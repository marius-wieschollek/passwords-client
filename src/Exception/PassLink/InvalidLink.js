export default class InvalidLink extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'InvalidLink';
    }

    constructor() {
        super('Invalid PassLink given');
    }
}