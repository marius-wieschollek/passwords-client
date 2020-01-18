import HttpError from './HttpError';

export default class UnauthorizedError extends HttpError {

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Unauthorized');
    }
}