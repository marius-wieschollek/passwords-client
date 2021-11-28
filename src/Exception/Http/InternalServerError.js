import HttpError from './HttpError';

export default class InternalServerError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'InternalServerError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Internal Server Error');
    }
}