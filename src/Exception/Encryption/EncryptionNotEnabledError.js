export default class EncryptionNotEnabledError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'EncryptionNotEnabledError';
    }

    constructor() {
        super(`CSE Encryption not enabled or ready`);
    }
}