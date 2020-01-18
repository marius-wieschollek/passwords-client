import HttpError from './HttpError';

export default class ForbiddenError extends HttpError {

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Forbidden');
    }
}