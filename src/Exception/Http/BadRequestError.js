import HttpError from './HttpError';

export default class BadRequestError extends HttpError {

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Bad Request');
    }
}