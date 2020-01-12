export default class NetworkError extends Error {

    get response() {
        return this._response;
    }

    /**
     *
     * @param {Response} response
     */
    constructor(response) {
        super(`Network error`);
        this._response = response;
    }
}