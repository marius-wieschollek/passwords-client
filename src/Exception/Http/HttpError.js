export default class HttpError extends Error {

    get response() {
        return this._response;
    }

    get status() {
        return this._status;
    }

    /**
     *
     * @param {Response} response
     * @param {String} statusText
     */
    constructor(response, statusText = '') {
        let message = `HTTP ${response.status}`;

        if(statusText.length !== 0) {
            message += ` - ${statusText}`;
        } else if(response.statusText.length !== 0) {
            message += ` - ${response.statusText}`;
        }

        super(message);
        this._response = response;
        this._status = response.status;
    }
}