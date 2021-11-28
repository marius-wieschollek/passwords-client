import HttpError from './HttpError';

export default class ForbiddenError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'ForbiddenError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Forbidden');
    }
}