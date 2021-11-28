import HttpError from './HttpError';

export default class TooManyRequestsError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'TooManyRequestsError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Too Many Requests');
    }
}