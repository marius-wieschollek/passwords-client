import sodium from 'libsodium-wrappers';

export default class ExportV1Encryption {

    /**
     * @param {EncryptionService} encryptionService
     */
    constructor(encryptionService) {
        this._encryptionService = encryptionService;
    }

    /**
     * Encrypts the message with the user defined password
     *
     * @param {String} message
     * @param {String} password
     * @returns {*}
     */
    async encrypt(message, password) {
        return await this._encryptionService.encryptAsync(message, password);
    }

    /**
     * Decrypts the message with the user defined password
     *
     * @param {String} message
     * @param {String} password
     * @returns {*}
     */
    async decrypt(message, password) {
        return await this._encryptionService.decryptAsync(message, password);
    }
}