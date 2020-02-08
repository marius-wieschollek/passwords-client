export default class CustomFieldConverter {

    /**
     * @param {Api} api
     */
    constructor(api) {
        this._api = api;
    }

    /**
     * @param {String} string
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
     * @param {Array} array
     * @return {CustomFieldCollection}
     * @api
     */
    fromArray(array) {
        let fields = [];

        for(let field of array) {
            fields.push(this.fromObject(field));
        }

        return this._api.getInstance('collection.field', fields);
    }

    /**
     * @param {Object} object
     * @return {AbstractField}
     * @api
     */
    fromObject(object) {
        let type = object.type;

        return this._api.getInstance(`model.${type}Field`, object);
    }
}