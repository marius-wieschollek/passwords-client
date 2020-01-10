import ApiResponse from './ApiResponse';
import ResponseContentTypeError from '../Exception/ResponseContentTypeError';

export default class ApiRequest {

    constructor() {
        this._url = null;
        this._path = null;
        this._data = null;
        this._session = null;
        this._responseType = 'application/json';
    }

    setUrl(value) {
        this._url = value;

        return this
    }

    /**
     * @returns {Session}
     */
    getSession() {
        return this._session;
    }

    /**
     *
     * @param {Session} value
     * @returns {ApiRequest}
     */
    setSession(value) {
        this._session = value;

        return this
    }

    setPath(value) {
        this._path = value;

        return this
    }

    setData(value) {
        this._data = value;

        return this
    }

    /**
     *
     * @returns {Promise<ApiResponse>}
     */
    async send() {
        let options = this._getRequestOptions();
        let httpResponse = await this._executeRequest(this._url + this._path, options);
        let expectedContentType = options.headers.get('content-type');
        let contentType = httpResponse.headers.get('content-type');

        let response = new ApiResponse()
            .setContentType(contentType)
            .setHeaders(httpResponse.headers)
            .setHttpStatus(httpResponse.status)
            .setHttpResponse(httpResponse);

        this._session.setId(httpResponse.headers.get('x-api-session'));

        if(expectedContentType !== null && contentType && contentType.indexOf(expectedContentType) === -1) {
            throw new ResponseContentTypeError(`Expected ${expectedContentType}, got ${contentType}`, response);
        } else if(contentType && contentType.indexOf('application/json') !== -1) {
            await this._processJsonResponse(httpResponse, response);
        } else {
            await this._processBinaryResponse(httpResponse, response);
        }

        //this._events.emit('api.request.after', response);

        return response
    }

    _getRequestOptions() {
        let headers = this._getRequestHeaders();
        let method  = 'GET';
        let options = {method, headers, credentials: 'omit', redirect: 'error'};
        if(this._data !== null) {
            options.body = JSON.stringify(this._data);
            method = 'POST';
        }
        options.method = method;

        return options;
    }

    _getRequestHeaders() {
        let headers = new Headers();

        if(this._session.getUser() !== null) {
            headers.append('authorization',  `Basic ${btoa(`${this._session.getUser()}:${this._session.getToken()}`)}`);
        } else if(this._session.getToken() !== null) {
            headers.append('authorization',  `Bearer ${btoa(this._session.getToken())}`);
        }

        headers.append('accept', this._responseType);

        if(this._data !== null) {
            headers.append('content-type', 'application/json');
        }

        if(this._session.getId() !== null) {
            headers.append('x-api-session', this._session.getId());
        }

        return headers;
    }

    /**
     *
     * @param url
     * @param options
     * @returns {Promise<Response>}
     * @private
     */
    async _executeRequest(url, options) {
        try {
            let request = new Request(url, options);

            return await fetch(request);
        } catch(e) {
            //this._config.events.emit('api.request.error', e);
            throw e;
        }
    }

    /**
     *
     * @param {Response} httpResponse
     * @param {ApiResponse} response
     * @private
     */
    async _processJsonResponse(httpResponse, response) {
        try {
            let json = await httpResponse.json();
            response.setData(json)
        } catch(e) {
            e.response = httpResponse;
            //this._config.events.emit('api.response.decoding.error', e);
            throw e;
        }

        if(!httpResponse.ok) {
            json.response = httpResponse;
            //this._config.events.emit('api.request.error', json);
            throw json;
        }

    }

    /**
     *
     * @param {Response} httpResponse
     * @param {ApiResponse} response
     * @private
     */
    async _processBinaryResponse(httpResponse, response) {
        try {
            let blob = await httpResponse.blob();
            response.setData(blob)
        } catch(e) {
            //this._config.events.emit('api.response.decoding.error', e);
            throw e;
        }

        if(!httpResponse.ok) {

            //this._config.events.emit('api.request.error', error);
            throw new Error('!httpResponse.ok');
        }
    }
}