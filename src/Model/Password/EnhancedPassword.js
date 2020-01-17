import Password from './Password';
import Url from 'url-parse';

export default class EnhancedPassword extends Password {

    /**
     *
     * @param {Api} api
     * @param {Object} [data={}]
     */
    constructor(data = {}, api) {
        super(data);
        this._api = api;
    }

    /**
     *
     * @returns {Server}
     */
    getServer() {
        return this._api.getServer();
    }

    /**
     *
     * @param {Number} [size=32]
     * @return {String}
     */
    getFaviconUrl(size = 32) {
        let host = 'default';

        if(this.getUrl()) {
            let url = Url(this.getUrl());

            if(url.host.length !== 0) {
                host = url.host;
            }
        }

        return `${this.getServer().getApiUrl()}1.0/service/favicon/${host}/${size}`;
    }

    /**
     *
     * @returns {Promise<Password[]>}
     */
    async fetchRevisions() {

    }

    /**
     *
     * @returns {Promise<Share[]>}
     */
    async fetchShare() {

    }

    /**
     *
     * @returns {Promise<Share[]>}
     */
    async fetchShares() {

    }

    /**
     *
     * @returns {Promise<Tag[]>}
     */
    async fetchTags() {
    }

    /**
     *
     * @returns {Promise<Folder[]>}
     */
    async fetchFolder() {

    }
}