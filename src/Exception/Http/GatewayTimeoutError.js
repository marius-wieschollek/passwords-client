import HttpError from './HttpError';

export default class GatewayTimeoutError extends HttpError {

    /**
     * @returns {String}
     */
    get name() {
        return 'GatewayTimeoutError';
    }

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Gateway Timeout');
    }
}