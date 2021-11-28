export default class NetworkError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'NetworkError';
    }

    /**
     * @returns {Response}
     */
    get response() {
        return this._response;
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(`Network error`);
        this._response = response;
    }
}