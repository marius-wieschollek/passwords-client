import sodium from 'libsodium-wrappers';

export default class EncryptionService {

    constructor() {
    }

    /**
     * Encrypt the message with the given key and return a hex encoded string
     *
     * @param {String} message
     * @param {String} key
     * @returns {String}
     * @private
     */
    encrypt(message, passphrase) {
        let {key, salt} = this._passwordToKey(passphrase);
        let encrypted = this._encrypt(message, key);

        return sodium.to_hex(new Uint8Array([...salt, ...encrypted]));
    }

    /**
     * Decrypt the hex or base64 encoded message with the given key
     *
     * @param {String} encodedString
     * @param {Uint8Array} key
     * @returns {String}
     * @private
     */
    _decryptString(encodedString, passphrase) {
        let salt = encodedString.slice(0, sodium.crypto_pwhash_SALTBYTES),
            text = encodedString.slice(sodium.crypto_pwhash_SALTBYTES),
            key  = this._passwordToKey(passphrase, salt);
        return sodium.to_string(this._decrypt(text, key));
    }

    /**
     * Encrypt the message with the given key
     *
     * @param {String} message
     * @param {String} key
     * @returns {Uint8Array}
     * @private
     */
    _encrypt(message, key) {
        let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

        return new Uint8Array([...nonce, ...sodium.crypto_secretbox_easy(message, nonce, key)]);
    }

    /**
     * Decrypt the message with the given key
     *
     * @param {Uint8Array} encrypted
     * @param {Uint8Array} key
     * @returns {Uint8Array}
     * @private
     */
    _decrypt(encrypted, key) {
        if(encrypted.length < sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES) throw new Error('Invalid encrypted text length');

        let nonce      = encrypted.slice(0, sodium.crypto_secretbox_NONCEBYTES),
            ciphertext = encrypted.slice(sodium.crypto_secretbox_NONCEBYTES);

        return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param password
     * @param salt
     * @returns {Uint8Array}
     * @private
     */
    _passwordToKey(password) {
        let salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

        let key = sodium.crypto_pwhash(
            sodium.crypto_box_SEEDBYTES,
            password,
            salt,
            sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
            sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
            sodium.crypto_pwhash_ALG_DEFAULT
        );

        return {key, salt};
    }
}