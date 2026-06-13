export default class AvatarService {

    /**
     * @param {BasicPasswordsClient} client
     * @param {(Blob|String|null)} fallbackAvatar
     */
    constructor(client, fallbackAvatar = null) {
        this._avatars = {};
        this._requests = {};
        this._client = client;
        this._fallbackAvatar = fallbackAvatar;
    }

    /**
     * Return icon if in cache, otherwise return default icon
     *
     * @param {String} user
     * @param {Number} size
     * @return {Promise<(Blob|String|null)>}
     */
    get(user, size = 32) {
        if(this._avatars.hasOwnProperty(`${user}_${size}`)) {
            return this._avatars[`${user}_${size}`];
        }

        return this._fallbackAvatar;
    }

    /**
     *
     * @param {String} user
     * @param {Number} size
     * @return {Promise<(Blob|String|null)>}
     */
    async fetch(user, size = 32) {
        if(this._avatars.hasOwnProperty(`${user}_${size}`)) {
            return this._avatars[`${user}_${size}`];
        }

        if(this._requests.hasOwnProperty(`${user}_${size}`)) {
            await this._requests[`${user}_${size}`];
            return this._avatars[`${user}_${size}`];
        }

        let request = this._queueAvatarRequest(user, size);

        return await request;
    }

    /**
     *
     * @param {String} user
     * @param {Number} size
     * @return {Promise<*>}
     * @private
     */
    async _queueAvatarRequest(user, size) {
        let promise = this._fetchAvatar(user, size);

        this._requests[`${user}_${size}`] = promise;

        return promise;
    }

    /**
     *
     * @param {String} user
     * @param {Number} size
     * @return {Promise<*>}
     * @private
     */
    async _fetchAvatar(user, size) {
        let cacheKey = `${user}_${size}`;
        try {
            /** @type {Blob} avatar **/
            let avatar = await this._sendAvatarRequest(user, size);

            if(avatar.type.substring(0, 6) !== 'image/' || avatar.size < 1) {
                if(!this._avatars.hasOwnProperty(cacheKey)) {
                    this._avatars[cacheKey] = this._fallbackAvatar;
                }

                return this._fallbackAvatar;
            }

            this._avatars[cacheKey] = avatar;

            return this._avatars[cacheKey];
        } catch(e) {
            if(!this._avatars.hasOwnProperty(cacheKey)) {
                this._avatars[cacheKey] = this._fallbackAvatar;
            }
            return this._fallbackAvatar;
        } finally {
            if(this._requests.hasOwnProperty(cacheKey)) {
                delete this._requests[cacheKey];
            }
        }
    }

    /**
     *
     * @param {String} user
     * @param {Number} size
     * @return {Promise<*>}
     * @private
     */
    async _sendAvatarRequest(user, size) {
        user = encodeURIComponent(user);

        let path    = `1.0/service/avatar/${user}/${size}`,
            request = this._client.getRequest(path, 'request.throttled', 'avatar');
        request.setResponseType('image/png');

        let response = await request.send();
        return response.getData();
    }
}