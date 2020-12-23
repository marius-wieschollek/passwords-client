export default class InvalidLink extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'InvalidLink';
    }

    /**
     * @param {String} action
     */
    constructor(action) {
        super(`Unknown PassLink action ${action}`);
    }
}