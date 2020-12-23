export default class UnknownPropertyError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'UnknownPropertyError';
    }

    /**
     * @returns {String}
     */
    get item() {
        return this._item;
    }

    /**
     * @returns {String}
     */
    get property() {
        return this._property;
    }

    /**
     * @param {String} property
     * @param {String} item
     */
    constructor(property, item) {
        super(`Read access to unknown property ${property}`);

        this._property = property;
        this._item = item;
    }
}