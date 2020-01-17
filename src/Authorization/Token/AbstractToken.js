export default class AbstractToken {

    /**
     *
     * @param {Api} api
     * @param {String} id
     * @param {String} label
     * @param {String} description
     * @param {Boolean} request
     */
    constructor(api, id, label, description, request) {
        this._id = id;
        this._api = api;
        this._label = label;
        this._description = description;
        this._request = request;
        this._token = null;
    }

    /**
     *
     * @return {String}
     */
    getType() {
        return 'abstract-token';
    }

    /**
     *
     * @return {String}
     */
    getId() {
        return this._id;
    }

    /**
     *
     * @return {String}
     */
    getLabel() {
        return this._label;
    }

    /**
     *
     * @return {String}
     */
    getDescription() {
        return this._description;
    }

    /**
     *
     * @return {Boolean}
     */
    requiresRequest() {
        return this._request;
    }

    /**
     *
     * @return {(String|null)}
     */
    getToken() {
        return this._token;
    }

    /**
     *
     * @return {Promise<boolean>}
     */
    async sendRequest() {
        if(!this.requiresRequest()) return true;

        try {
            await this._api
                .getRequest()
                .setPath(`1.0/token/${this._id}/request`)
                .send();
            return true;
        } catch(e) {
            console.error(e);
        }

        return false;
    }

    /**
     *
     * @return {Object}
     */
    toJSON() {
        return {
            type       : this.getType,
            id         : this._id,
            label      : this._label,
            description: this._description,
            request    : this._request
        };
    }
}