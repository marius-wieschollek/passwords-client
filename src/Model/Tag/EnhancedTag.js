import Tag from './Tag';

export default class EnhancedTag extends Tag {

    /**
     *
     * @param {Object} [data={}]
     * @param {BasicPasswordsClient} api
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
     * @returns {Promise<TagCollection>}
     */
    async fetchRevisions() {

    }

    /**
     *
     * @returns {Promise<PasswordCollection>}
     */
    async fetchPasswords() {

    }
}