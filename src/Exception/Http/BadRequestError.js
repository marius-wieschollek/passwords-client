import HttpError from './HttpError';

export default class BadRequestError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'BadRequestError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Bad Request');
    }
}