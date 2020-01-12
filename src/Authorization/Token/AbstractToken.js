export default class AbstractToken {

    /**
     *
     * @param {Api} api
     * @param {string} id
     * @param {string} label
     * @param {string} description
     * @param {boolean} request
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
     * @return {string}
     */
    getType() {
        return 'abstract-token';
    }

    /**
     *
     * @return {string}
     */
    getId() {
        return this._id;
    }

    /**
     *
     * @return {string}
     */
    getLabel() {
        return this._label;
    }

    /**
     *
     * @return {string}
     */
    getDescription() {
        return this._description;
    }

    /**
     *
     * @return {boolean}
     */
    requiresRequest() {
        return this._request;
    }

    /**
     *
     * @return {(string|null)}
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
                .setPath(`api/1.0/token/${this._id}/request`)
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