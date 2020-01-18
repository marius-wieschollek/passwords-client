import HttpError from './HttpError';

export default class InternalServerError extends HttpError {

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Internal Server Error');
    }
}