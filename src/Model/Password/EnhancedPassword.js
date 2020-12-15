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
     * @param {(String|Number)} width
     * @param {(String|Number)} height
     * @param {String} view
     * @return {String}
     */
    getPreviewUrl(width = 640, height = '360...', view = 'desktop') {
        let host = 'default';

        if(this.getUrl()) {
            let url = Url(this.getUrl());

            if(url.host.length !== 0) {
                host = url.host;
            }
        }

        return `${this.getServer().getApiUrl()}1.0/service/preview/${host}/${view}/${width}/${height}`;
    }

    /**
     *
     * @returns {Promise<PasswordCollection>}
     */
    async fetchRevisions() {
    }

    /**
     *
     * @returns {Promise<Share>}
     */
    async fetchShare() {
    }

    /**
     *
     * @returns {Promise<ShareCollection>}
     */
    async fetchShares() {
    }

    /**
     *
     * @returns {Promise<TagCollection>}
     */
    async fetchTags() {
    }

    /**
     *
     * @returns {Promise<FolderCollection>}
     */
    async fetchFolder() {
    }
}