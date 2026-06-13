import Password from './Password';
import Url from 'url-parse';

export default class EnhancedPassword extends Password {

    /**
     *
     * @param {BasicPasswordsClient} api
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
     * @param {Boolean} [pathOnly=false]
     * @return {String}
     */
    getFaviconUrl(size = 32, pathOnly = false) {
        let host = this.getHost() ?? 'default';

        if(pathOnly) return `1.0/service/favicon/${host}/${size}`;

        return `${this.getServer().getApiUrl()}1.0/service/favicon/${host}/${size}`;
    }

    /**
     *
     * @param size
     * @returns {Promise<Blob>}
     */
    async getFavicon(size = 32) {
        let response = await this._api.getInstance('service.favicon', null).get(this.getHost(), size);

        return response.getData();
    }

    /**
     *
     * @param {(String|Number)} width
     * @param {(String|Number)} height
     * @param {String} view
     * @param {Boolean} [pathOnly=false]
     * @return {String}
     */
    getPreviewUrl(width = 640, height = '360...', view = 'desktop', pathOnly = false) {
        let host = this.getHost() ?? 'default';

        if(pathOnly) return `1.0/service/preview/${host}/${view}/${width}/${height}`;

        return `${this.getServer().getApiUrl()}1.0/service/preview/${host}/${view}/${width}/${height}`;
    }

    /**
     *
     * @param {(String|Number)} width
     * @param {(String|Number)} height
     * @param {String} view
     * @returns {Promise<Blob>}
     */
    async getPreview(width = 640, height = '360...', view = 'desktop') {
        let response = await this._api.getInstance('service.preview', null).get(this.getHost(), view, width, height);

        return response.getData();
    }

    /**
     * @return {String|null}
     */
    getHost() {
        if(this.getUrl()) {
            let url = Url(this.getUrl());

            if(url.length !== 0) {
                return url.hostname;
            }
        }

        return null;
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