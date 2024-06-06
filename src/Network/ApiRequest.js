import ApiResponse from './ApiResponse';
import Base64Utility from "../Utility/Base64Utility";

export default class ApiRequest {

    /**
     *
     * @param {BasicPasswordsClient} api
     * @param {String} [url=null]
     * @param {Session} [session=null]
     */
    constructor(api, url = null, session = null) {
        this._api = api;
        this._url = url;
        this._path = null;
        this._data = null;
        this._method = null;
        this._userAgent = null;
        this._session = session;
        this._acceptedStatusCodes = null;
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
     * @returns {ApiRequest}
     */
    setUrl(value) {
        this._url = value;

        return this;
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

        return this;
    }

    /**
     *
     * @param {String} value
     * @return {ApiRequest}
     */
    setPath(value) {
        this._path = value;

        return this;
    }

    /**
     *
     * @param {Object} value
     * @return {ApiRequest}
     */
    setData(value) {
        this._data = value;

        return this;
    }

    /**
     *
     * @param {String} value
     * @return {ApiRequest}
     */
    setMethod(value) {
        this._method = value.toUpperCase();

        return this;
    }

    /**
     *
     * @param {String} value
     * @returns {ApiRequest}
     */
    setResponseType(value) {
        this._responseType = value;

        return this;
    }

    /**
     *
     * @param {String} value
     * @return {ApiRequest}
     */
    setUserAgent(value) {
        this._userAgent = value;

        return this;
    }

    /**
     * @param {(Number[]|null)} value
     *
     * @return {ApiRequest}
     */
    setAcceptedStatusCodes(value) {
        this._acceptedStatusCodes = value;

        return this;
    }

    /**
     *
     * @return {(Number[]|null)}
     */
    getAcceptedStatusCodes() {
        return this._acceptedStatusCodes;
    }

    /**
     *
     * @returns {Promise<ApiResponse>}
     */
    async send() {
        let options = this._getRequestOptions();
        let httpResponse = await this._executeRequest(this._url + this._path, options);
        let contentType = httpResponse.headers.get('content-type');

        let response = new ApiResponse()
            .setContentType(contentType)
            .setHeaders(httpResponse.headers)
            .setHttpStatus(httpResponse.status)
            .setHttpResponse(httpResponse);

        this._updateSessionId(httpResponse);

        if(!this._isRequestOk(httpResponse)) {
            let error = this._getHttpError(httpResponse);
            this._api.emit('request.error', error);
            throw error;
        }

        if(this._responseType !== null && contentType && contentType.indexOf(this._responseType) === -1) {
            let error = this._api.getClass('exception.contenttype', this._responseType, contentType, httpResponse);
            this._api.emit('request.error', error);
            throw error;
        }

        if(contentType && contentType.indexOf('application/json') !== -1) {
            await this._processJsonResponse(httpResponse, response);
        } else {
            await this._processBinaryResponse(httpResponse, response);
        }

        this._api.emit('request.after', response);

        return response;
    }

    /**
     *
     * @param {Response} httpResponse
     * @return {boolean}
     * @private
     */
    _isRequestOk(httpResponse) {
        if(this._acceptedStatusCodes !== null) {
            return this._acceptedStatusCodes.indexOf(httpResponse.status) !== -1;
        }

        return httpResponse.ok;
    }

    /**
     *
     * @param {Response} httpResponse
     * @private
     */
    _updateSessionId(httpResponse) {
        if(httpResponse.headers.has('x-api-session')) {
            if(httpResponse.headers.has('cache-control') && httpResponse.headers.get('cache-control').indexOf('immutable') !== -1) return;
            if(httpResponse.headers.has('pragma') && httpResponse.headers.get('pragma') === 'cache') return;

            if(httpResponse.headers.has('date')) {
                let date = new Date(httpResponse.headers.get('date')),
                    now  = Date.now() - 300000;
                if(date.getTime() < now) return;
            }

            this._session.setId(httpResponse.headers.get('x-api-session'));
        }
    }

    /**
     *
     * @return {{redirect: string, headers: Headers, method: string, credentials: string}}
     * @private
     */
    _getRequestOptions() {
        let headers = this._getRequestHeaders();
        let method = this._method === null ? 'GET':this._method;
        let options = {method, headers, credentials: 'omit', redirect: 'error'};
        if(this._data !== null) {
            options.body = JSON.stringify(this._data);
            if(method === 'GET') options.method = 'POST';
        }

        return options;
    }

    /**
     *
     * @return {Headers}
     * @private
     */
    _getRequestHeaders() {
        let headers = new Headers();

        if(this._session.getUser() !== null) {
            headers.append('authorization', `Basic ${Base64Utility.encode(`${this._session.getUser()}:${this._session.getToken()}`)}`);
        } else if(this._session.getToken() !== null) {
            headers.append('authorization', `Bearer ${Base64Utility.encode(this._session.getToken())}`);
        }

        headers.append('accept', this._responseType);

        if(this._data !== null) {
            headers.append('content-type', 'application/json');
        }

        if(this._userAgent !== null) {
            headers.append('user-agent', this._userAgent);
        }

        if(this._session.getId() !== null) {
            headers.append('x-api-session', this._session.getId());
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
            this._api.emit('request.before', request);

            return await fetch(request);
        } catch(e) {
            this._api.emit('request.error', e);
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
            response.setData(json);
        } catch(e) {
            let error = this._api.getClass('exception.decoding', httpResponse, e);
            this._api.emit('request.decoding.error', error);
            throw error;
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
            response.setData(blob);
        } catch(e) {
            let error = this._api.getClass('exception.decoding', httpResponse, e);
            this._api.emit('request.decoding.error', error);
            throw error;
        }
    }

    /**
     *
     * @param {Response} response
     * @private
     */
    _getHttpError(response) {
        if([400, 401, 403, 404, 405, 412, 429, 500, 502, 503, 504].indexOf(response.status) !== -1) {
            return this._api.getClass(`exception.http.${response.status}`, response);
        }
        if(response.status > 99) {
            return this._api.getClass('exception.http', response);
        }

        return this._api.getClass('exception.network', response);
    }
}