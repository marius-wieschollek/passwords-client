export default class PreviewService {

    /**
     * @param {BasicPasswordsClient} client
     * @param {(Blob|String|null)} fallbackImage
     */
    constructor(client, fallbackImage = null) {
        this._previews = {};
        this._requests = {};
        this._client = client;
        this._fallbackImage = fallbackImage;
    }

    /**
     * Return preview if in cache, otherwise return default image
     *
     * @param {String} domain
     * @param {String} [view="desktop"]
     * @param {(Number|String)} [width="640"]
     * @param {(Number|String)} [height="360..."]
     * @return {Promise<(Blob|String|null)>}
     */
    get(domain, view = 'desktop', width = '640', height = '360...') {
        this._validateInput(view, width, height);
        let cacheKey = this._generateCacheKey(domain, view, width, height);
        if(this._previews.hasOwnProperty(cacheKey)) {
            return this._previews[cacheKey];
        }

        return this._fallbackImage;
    }

    /**
     * Fetch preview image from webserver
     *
     * @param {String} domain
     * @param {String} [view="desktop"]
     * @param {(Number|String)} [width="640"]
     * @param {(Number|String)} [height="360..."]
     * @return {Promise<(Blob|String|null)>}
     */
    async fetch(domain, view = 'desktop', width = '640', height = '360...') {
        this._validateInput(view, width, height);
        let cacheKey = this._generateCacheKey(domain, view, width, height);
        if(this._previews.hasOwnProperty(cacheKey)) {
            return this._previews[cacheKey];
        }

        if(this._requests.hasOwnProperty(cacheKey)) {
            await this._requests[cacheKey];
            return this._previews[cacheKey];
        }

        let request = this._queuePreviewRequest(cacheKey, domain, view, width, height);

        return await request;
    }

    /**
     *
     * @param {String} cacheKey
     * @param {String} domain
     * @param {String} view
     * @param {(Number|String)} width
     * @param {(Number|String)} height
     * @return {Promise<(Blob|String|null)>}
     * @private
     */
    async _queuePreviewRequest(cacheKey, domain, view, width, height) {
        let promise = this._fetchPreview(cacheKey, domain, view, width, height);

        this._requests[cacheKey] = promise;

        return promise;
    }

    /**
     *
     * @param {String} cacheKey
     * @param {String} domain
     * @param {String} view
     * @param {(Number|String)} width
     * @param {(Number|String)} height
     * @return {Promise<(Blob|String|null)>}
     * @private
     */
    async _fetchPreview(cacheKey, domain, view, width, height) {
        try {
            /** @type {Blob} preview **/
            let preview = await this._sendPreviewRequest(domain, view, width, height);

            if(preview.type.substring(0, 6) !== 'image/' || preview.size < 1) {
                if(!this._previews.hasOwnProperty(cacheKey)) {
                    this._previews[cacheKey] = this._fallbackImage;
                }

                return this._fallbackImage;
            }

            this._previews[cacheKey] = preview;

            return this._previews[cacheKey];
        } catch(e) {
            if(!this._previews.hasOwnProperty(cacheKey)) {
                this._previews[cacheKey] = this._fallbackImage;
            }
            return this._fallbackImage;
        } finally {
            if(this._requests.hasOwnProperty(cacheKey)) {
                delete this._requests[cacheKey];
            }
        }
    }

    /**
     *
     * @param {String} domain
     * @param {String} view
     * @param {(Number|String)} width
     * @param {(Number|String)} height
     * @return {Promise<*>}
     * @private
     */
    async _sendPreviewRequest(domain, view, width, height) {
        domain = encodeURIComponent(domain);

        let path = `1.0/service/preview/${domain}/${view}/${width}/${height}`, request = this._client.getRequest(path, 'request.throttled', 'preview');
        request.setResponseType('image/jpeg');

        let response = await request.send();
        return response.getData();
    }

    /**
     *
     * @param {String} domain
     * @param {String} view
     * @param {String} width
     * @param {String} height
     * @return {String}
     * @private
     */
    _validateInput(view, width, height) {
        if(view !== 'desktop' && view !== 'mobile') {
            throw this._client.getClass('exception.service.options', 'view');
        }

        let params = {width, height};
        for(let key in params) {
            let value = params[key];
            if(!Number.isNaN(value)) {
                if(value >= 240 && value <= 1280) {
                    continue;
                }
            }

            if(value.indexOf('...') !== -1) {
                let limits = value.split('...');
                if(limits.length === 2 &&
                   (limits[0] === '' || (limits[0] >= 240 && limits[0] <= 1280)) &&
                   (limits[1] === '' || (limits[1] >= 240 && limits[1] <= 1280)) &&
                   (limits[0] === '' || limits[1] === '' || limits[1] >= limits[0])) {
                    continue;
                }
            }

            throw this._client.getClass('exception.service.options', key);
        }
    }

    /**
     *
     * @param {String} domain
     * @param {String} view
     * @param {String} width
     * @param {String} height
     * @return {String}
     * @private
     */
    _generateCacheKey(domain, view, width, height) {
        return `${domain}_${view}_${width}_${height}`;
    }
}