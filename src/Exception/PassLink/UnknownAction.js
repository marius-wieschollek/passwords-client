export default class UnknownAction extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'UnknownAction';
    }

    /**
     * @param {String} action
     */
    constructor(action) {
        super(`Unknown PassLink action ${action}`);
    }
}