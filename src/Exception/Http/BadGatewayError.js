import HttpError from './HttpError';

export default class BadGatewayError extends HttpError {

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Bad Gateway');
    }
}