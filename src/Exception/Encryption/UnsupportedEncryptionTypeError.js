export default class UnsupportedEncryptionTypeError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'UnsupportedEncryptionTypeError';
    }

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

    /**
     * @param {Object} object
     * @param {(String|String[])} supportedTypes
     */
    constructor(object, supportedTypes) {
        if(Array.isArray(supportedTypes)) {
            supportedTypes = supportedTypes.join(', ');
        }

        super(`Unsupported encryption type "${object.cseType}" in ${object.id}. Supported types are ${supportedTypes}.`);

        this._object = object;
        this._supportedTypes = supportedTypes;
    }
}