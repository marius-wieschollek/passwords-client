import HttpError from './HttpError';

export default class NotFoundError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'NotFoundError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Not Found');
    }
}