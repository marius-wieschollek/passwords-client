export default class UnknownPropertyError extends Error {

    get item() {
        return this._item;
    }

    get property() {
        return this._property;
    }

    constructor(property, item) {
        super(`Read access to unknown property ${property}`);

        this._property = property;
        this._item = item;
    }
}