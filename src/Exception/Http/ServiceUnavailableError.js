import HttpError from './HttpError';

export default class ServiceUnavailableError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'ServiceUnavailableError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Service Unavailable');
    }
}