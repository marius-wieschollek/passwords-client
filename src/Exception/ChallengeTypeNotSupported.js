export default class ChallengeTypeNotSupported extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'ChallengeTypeNotSupported';
    }

    /**
     *
     */
    constructor() {
        super('The required authentication challenge is not supported by this client');
    }
}