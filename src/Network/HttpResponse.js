export default class HttpResponse {

    constructor() {
        this._data = null;
        this._headers = [];
        this._contentType = 'text/plain';
        this._httpStatus = 0;
        this._response = {};
    }

    getData() {
        return this._data;
    }

    setData(value) {
        this._data = value;

        return this;
    }

    getHeaders() {
        return this._headers;
    }

    setHeaders(value) {
        this._headers = value;

        return this;
    }

    getContentType() {
        return this._contentType;
    }

    setContentType(value) {
        this._contentType = value;

        return this;
    }

    getHttpStatus() {
        return this._httpStatus;
    }

    setHttpStatus(value) {
        this._httpStatus = value;

        return this;
    }

    getHttpResponse() {
        return this._response;
    }

    setHttpResponse(value) {
        this._response = value;
        return this;
    }

}