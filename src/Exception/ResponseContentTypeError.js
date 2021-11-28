export default class ResponseContentTypeError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'ResponseContentTypeError';
    }

    /**
     * @returns {Response}
     */
    get response() {
        return this._response;
    }

    /**
     * @param {String} expectedType
     * @param {String} actualType
     * @param {Response} response
     */
    constructor(expectedType, actualType, response) {
        super(`Expected ${expectedType}, got ${actualType}`);

        this._response = response;
    }
}