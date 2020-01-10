export default class HttpError extends Error {

    get response() {
        return this._response;
    }

    /**
     *
     * @param {Response} response
     */
    constructor(response) {
        super(`${response.status} - ${response.statusText}`);
        this._response = response;
    }
}