export default class ResponseDecodingError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'ResponseDecodingError';
    }

    /**
     * @returns {Response}
     */
    get response() {
        return this._response;
    }

    /**
     * @returns {Error}
     */
    get error() {
        return this._error;
    }

    /**
     * @param {Response} response
     * @param {Error} error
     * @param {String} message
     */
    constructor(response, error, message = '') {

        if(message.length === 0) {
            message = error.message;
        }

        super(message);

        this._response = response;
        this._error = error;
    }
}