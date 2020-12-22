export default class UnsupportedEncryptionTypeError extends Error {

    /**
     * @returns {String}
     */
    get supportedTypes() {
        return this._supportedTypes;
    }

    /**
     * @returns {Object}
     */
    get object() {
        return this._object;
    }

    constructor(object, supportedTypes) {
        if(Array.isArray(supportedTypes)) {
            supportedTypes = supportedTypes.join(', ');
        }

        super(`Unsupported encryption type "${object.cseType}" in ${object.id}. Supported types are ${supportedTypes}.`);

        this._object = object;
        this._supportedTypes = supportedTypes;
    }
}