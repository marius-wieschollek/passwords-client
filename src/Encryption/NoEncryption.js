export default class NoEncryption {

    /**
     *
     * @returns {Promise<Boolean>}
     */
    async ready() {
        return true;
    }

    /**
     *
     * @returns {Boolean}
     */
    async enabled() {
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
        if(object.cseType !== 'none') throw new Error('Unsupported encryption type');
        return object;
    }
}