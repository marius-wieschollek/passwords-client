export default class CustomFieldConverter {

    /**
     * @param {Api} api
     */
    constructor(api) {
        this._api = api;
    }

    /**
     * @param {String} string
     *
     * @return {(CustomFieldCollection|AbstractField)}
     * @api
     */
    fromJSON(string) {
        let data = JSON.parse(string);

        if(Array.isArray(data)) {
            return this.fromArray(data);
        }

        if(typeof data === 'object' && data instanceof Object) {
            return this.fromObject(data);
        }
    }

    /**
     * @param {Object} object
     * @return {AbstractField}
     * @api
     */
    fromObject(object) {
        let type = object.type;

        return this._api.getClass(`model.${type}Field`, object);
    }

    /**
     * @param {Object[]} array
     * @return {CustomFieldCollection}
     * @api
     */
    fromArray(array) {
        let fields = [];

        for(let field of array) {
            fields.push(this.fromObject(field));
        }

        return this._api.getClass('collection.field', fields);
    }

    /**
     * @param {CustomFieldCollection} collection
     * @return {Object[]}
     */
    toArray(collection) {
        let array = [];

        for(let field of collection) {
            array.push(this.toObject(field));
        }

        return array;
    }

    /**
     * @param {AbstractField} field
     * @return {Object}
     */
    toObject(field) {
        return field.getProperties();
    }

    /**
     * @param {AbstractField} field
     * @return {String}
     */
    toJSON(field) {
        return JSON.stringify(field);
    }
}