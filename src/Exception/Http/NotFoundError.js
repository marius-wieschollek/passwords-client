import HttpError from './HttpError';

export default class NotFoundError extends HttpError {

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Not Found');
    }
}