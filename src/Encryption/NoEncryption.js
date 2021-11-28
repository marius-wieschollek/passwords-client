export default class NoEncryption {

    /**
     * @param {BasicClassLoader} classLoader
     */
    constructor(classLoader) {
        this._classLoader = classLoader;
    }

    /**
     * @returns {Promise<Boolean>}
     */
    async ready() {
        return true;
    }

    /**
     * @returns {Boolean}
     */
    enabled() {
        return true;
    }

    /**
     * Encrypts an object
     *
     * @param {Object} object
     * @param {String} type
     * @returns {Object}
     */
    async encrypt(object, type) {
        object.cseType = 'none';
        object.cseKey = '';
        return object;
    }

    /**
     * Decrypts an object
     *
     * @param {Object} object
     * @param {String} type
     * @returns {Object}
     */
    async decrypt(object, type) {
        if(object.cseType !== 'none') throw this._classLoader.getClass('exception.encryption.unsupported', object, 'none');
        return object;
    }
}