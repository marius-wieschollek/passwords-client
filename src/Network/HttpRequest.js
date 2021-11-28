import ResponseDecodingError from '../Exception/ResponseDecodingError';
import NetworkError from '../Exception/NetworkError';
import HttpError from '../Exception/Http/HttpError';
import ResponseContentTypeError from '../Exception/ResponseContentTypeError';
import HttpResponse from './HttpResponse';

export default class HttpRequest {

    /**
     *
     * @param {String} [url=null]
     */
    constructor(url = null) {
        this._url = url;
        this._data = null;
        this._userAgent = null;
        this._responseType = 'application/json';
    }

    /**
     *
     * @returns {(String|null)}
     */
    getUrl() {
        return this._url;
    }

    /**
     *
     * @param {Session} value
     * @returns {HttpRequest}
     */
    setUrl(value) {
        this._url = value;

        return this;
    }

    /**
     *
     * @param {Object} value
     * @return {HttpRequest}
     */
    setData(value) {
        this._data = value;

        return this;
    }

    /**
     *
     * @param {String} value
     * @return {HttpRequest}
     */
    setUserAgent(value) {
        this._userAgent = value;

        return this;
    }

    /**
     *
     * @returns {Promise<HttpResponse>}
     */
    async send() {
        let options = this._getRequestOptions();
        let httpResponse = await this._executeRequest(this._url, options);
        let expectedContentType = options.headers.get('content-type');
        let contentType = httpResponse.headers.get('content-type');

        let response = new HttpResponse()
            .setContentType(contentType)
            .setHeaders(httpResponse.headers)
            .setHttpStatus(httpResponse.status)
            .setHttpResponse(httpResponse);

        if(expectedContentType !== null && contentType && contentType.indexOf(expectedContentType) === -1) {
            throw new ResponseContentTypeError(expectedContentType, contentType, httpResponse);
        } else if(contentType && contentType.indexOf('application/json') !== -1) {
            await this._processJsonResponse(httpResponse, response);
        } else {
            await this._processBinaryResponse(httpResponse, response);
        }

        return response;
    }

    /**
     *
     * @return {{redirect: string, headers: Headers, method: string, credentials: string}}
     * @private
     */
    _getRequestOptions() {
        let headers = this._getRequestHeaders();
        let method = 'GET';
        let options = {method, headers, credentials: 'omit', redirect: 'error'};
        if(this._data !== null) {
            options.body = JSON.stringify(this._data);
            method = 'POST';
        }
        options.method = method;

        return options;
    }

    /**
     *
     * @return {Headers}
     * @private
     */
    _getRequestHeaders() {
        let headers = new Headers();

        headers.append('accept', this._responseType);

        if(this._data !== null) {
            headers.append('content-type', 'application/json');
        }

        if(this._userAgent !== null) {
            headers.append('user-agent', this._userAgent);
        }

        return headers;
    }

    /**
     *
     * @param {String} url
     * @param {Object} options
     * @returns {Promise<Response>}
     * @private
     */
    async _executeRequest(url, options) {
        try {
            let request = new Request(url, options);

            return await fetch(request);
        } catch(e) {
            throw e;
        }
    }

    /**
     *
     * @param {Response} httpResponse
     * @param {HttpResponse} response
     * @private
     */
    async _processJsonResponse(httpResponse, response) {
        if(!httpResponse.ok) {
            throw this._getHttpError(httpResponse);
        }

        try {
            let json = await httpResponse.json();
            response.setData(json);
        } catch(e) {
            throw new ResponseDecodingError(response, e);
        }
    }

    /**
     *
     * @param {Response} httpResponse
     * @param {HttpResponse} response
     * @private
     */
    async _processBinaryResponse(httpResponse, response) {
        if(!httpResponse.ok) {
            throw this._getHttpError(httpResponse);
        }

        try {
            let blob = await httpResponse.blob();
            response.setData(blob);
        } catch(e) {
            throw new ResponseDecodingError(response, e);
        }
    }

    /**
     *
     * @param {Response} response
     * @private
     */
    _getHttpError(response) {
        if(response.status > 99) {
            return new HttpError(response);
        }

        return new NetworkError(response);
    }
}