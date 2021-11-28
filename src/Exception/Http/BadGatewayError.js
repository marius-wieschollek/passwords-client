import HttpError from './HttpError';

export default class BadGatewayError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'BadGatewayError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Bad Gateway');
    }
}