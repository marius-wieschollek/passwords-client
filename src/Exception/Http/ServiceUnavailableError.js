import HttpError from './HttpError';

export default class ServiceUnavailableError extends HttpError {

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Service Unavailable');
    }
}