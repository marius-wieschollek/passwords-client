export default class ResponseDecodingError extends Error {

    get response() {
        return this._response;
    }

    get error() {
        return this._error;
    }

    constructor(response, error, message = '') {

        if(message.length === 0) {
            message = error.message;
        }

        super(message);

        this._response = response;
        this._error = error;
    }
}