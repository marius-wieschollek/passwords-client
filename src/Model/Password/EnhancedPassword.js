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
        let host = 'default';

        if(this.getUrl()) {
            let url = Url(this.getUrl());

            if(url.host.length !== 0) {
                host = url.host;
            }
        }

        if(pathOnly) return `1.0/service/favicon/${host}/${size}`;

        return `${this.getServer().getApiUrl()}1.0/service/favicon/${host}/${size}`;
    }

    /**
     *
     * @param size
     * @returns {Promise<Blob>}
     */
    async getFavicon(size = 32) {
        let path = this.getFaviconUrl(size, true),
            response = await this._api.getRequest().setPath(path).setResponseType('image/png').send();

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
        let host = 'default';

        if(this.getUrl()) {
            let url = Url(this.getUrl());

            if(url.host.length !== 0) {
                host = url.host;
            }
        }

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
    async getPreview(width = 640, height = '360...', view) {
        let path = this.getPreviewUrl(size, true),
            response = await this._api.getRequest().setPath(path).setResponseType('image/jpeg').send();

        return response.getData();
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