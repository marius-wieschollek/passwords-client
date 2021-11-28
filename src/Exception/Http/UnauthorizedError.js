import HttpError from './HttpError';

export default class UnauthorizedError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'UnauthorizedError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Unauthorized');
    }
}