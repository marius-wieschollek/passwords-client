export default class CustomFieldConverter {

    /**
     * @param {BasicPasswordsClient} client
     */
    constructor(client) {
        this._client = client;
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
        if(!object.hasOwnProperty('type') || object.type === null) {
            this._client.getLogger().warning('Ignoring invalid custom field data', {field: object});
            this._client.getClass(`model.defectField`, {label:'##ERROR##', value:JSON.stringify(object)})
        }

        let type = object.type;

        return this._client.getClass(`model.${type}Field`, object);
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

        return this._client.getClass('collection.field', fields);
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