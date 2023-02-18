import HttpError from './HttpError';

export default class PreconditionFailedError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'PreconditionFailedError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Precondition failed');
    }
}