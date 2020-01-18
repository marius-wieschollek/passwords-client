import HttpError from './HttpError';

export default class TooManyRequestsError extends HttpError {

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Too Many Requests');
    }
}