export default class ResponseContentTypeError extends Error {

    get response() {
        return this._response;
    }

    constructor(expectedType, actualType, response) {
        super(`Expected ${expectedType}, got ${actualType}`);

        this._response = response;
    }
}