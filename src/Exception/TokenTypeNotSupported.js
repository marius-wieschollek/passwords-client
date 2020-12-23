export default class TokenTypeNotSupported extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'TokenTypeNotSupported';
    }

    /**
     *
     */
    constructor() {
        super('None of the available tokens are supported by this client.');
    }
}