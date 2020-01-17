import Tag from './Tag';

export default class EnhancedTag extends Tag {

    /**
     *
     * @param {Object} [data={}]
     * @param {Api} api
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
     * @returns {Promise<Tag[]>}
     */
    async fetchRevisions() {

    }

    /**
     *
     * @returns {Promise<Password[]>}
     */
    async fetchPasswords() {

    }
}