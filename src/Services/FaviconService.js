export default class FaviconService {

    /**
     * @param {BasicPasswordsClient} client
     * @param {(Blob|String|null)} fallbackIcon
     */
    constructor(client, fallbackIcon = null) {
        this._favicons = {};
        this._requests = {};
        this._client = client;
        this._fallbackIcon = fallbackIcon;
    }

    /**
     * Return icon if in cache, otherwise return default icon
     *
     * @param {String} domain
     * @param {Number} size
     * @return {Promise<(Blob|String|null)>}
     */
    get(domain, size = 32) {
        if(this._favicons.hasOwnProperty(`${domain}_${size}`)) {
            return this._favicons[`${domain}_${size}`];
        }

        return this._fallbackIcon;
    }

    /**
     *
     * @param {String} domain
     * @param {Number} size
     * @return {Promise<(Blob|String|null)>}
     */
    async fetch(domain, size = 32) {
        if(this._favicons.hasOwnProperty(`${domain}_${size}`)) {
            return this._favicons[`${domain}_${size}`];
        }

        if(this._requests.hasOwnProperty(`${domain}_${size}`)) {
            await this._requests[`${domain}_${size}`];
            return this._favicons[`${domain}_${size}`];
        }

        let request = this._queueFaviconRequest(domain, size);

        return await request;
    }

    /**
     *
     * @param {String} domain
     * @param {Number} size
     * @return {Promise<*>}
     * @private
     */
    async _queueFaviconRequest(domain, size) {
        let promise = this._fetchFavicon(domain, size);

        this._requests[`${domain}_${size}`] = promise;

        return promise;
    }

    /**
     *
     * @param {String} domain
     * @param {Number} size
     * @return {Promise<*>}
     * @private
     */
    async _fetchFavicon(domain, size) {
        try {
            /** @type {Blob} favicon **/
            let favicon = await this._sendFaviconRequest(domain, size);

            if(favicon.type.substring(0, 6) !== 'image/' || favicon.size < 1) {
                delete this._requests[`${domain}_${size}`];

                if(!this._favicons.hasOwnProperty(`${domain}_${size}`)) {
                    this._favicons[`${domain}_${size}`] = this._fallbackIcon;
                }

                return this._fallbackIcon;
            }

            this._favicons[`${domain}_${size}`] = favicon;
            delete this._requests[`${domain}_${size}`];

            return this._favicons[`${domain}_${size}`];
        } catch(e) {
            if(this._requests.hasOwnProperty(`${domain}_${size}`)) {
                delete this._requests[`${domain}_${size}`];
            }
            if(!this._favicons.hasOwnProperty(`${domain}_${size}`)) {
                this._favicons[`${domain}_${size}`] = this._fallbackIcon;
            }
            return this._fallbackIcon;
        }
    }

    /**
     *
     * @param {String} domain
     * @param {Number} size
     * @return {Promise<*>}
     * @private
     */
    async _sendFaviconRequest(domain, size) {
        if(domain === null || domain.length === 0) domain = 'default';
        domain = encodeURIComponent(domain);

        let path    = `1.0/service/favicon/${domain}/${size}`,
            request = this._client.getRequest(path, 'request.throttled', 'favicon');
        request.setResponseType('image/png');

        let response = await request.send();
        return response.getData();
    }
}