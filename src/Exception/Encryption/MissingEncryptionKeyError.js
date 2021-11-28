export default class MissingEncryptionKeyError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'MissingEncryptionKeyError';
    }

    /**
     * @param {String} id
     */
    constructor(id) {
        super(`Requested encryption key ${id} not found`);
    }
}