import HttpError from './HttpError';

export default class GatewayTimeoutError extends HttpError {

    /**
     * @param {Response} response
     */
    constructor(response) {
        super(response, 'Gateway Timeout');
    }
}