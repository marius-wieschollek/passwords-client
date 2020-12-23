import HttpError from './HttpError';

export default class MethodNotAllowedError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'MethodNotAllowedError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Method Not Allowed');
    }
}