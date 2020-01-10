import sodium from 'libsodium-wrappers';
import CSEv1Encryption from './CSEv1Encryption';

export default class ExportV1Encryption extends CSEv1Encryption {

    /**
     * Encrypts the message with the user defined password
     *
     * @param message
     * @param password
     * @returns {*}
     */
    encryptWithPassword(message, password) {
        let salt      = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES),
            key       = this._passwordToKey(password, salt),
            encrypted = this._encrypt(message, key);

        return sodium.to_base64(new Uint8Array([...salt, ...encrypted]));
    }

    /**
     * Decrypts the message with the user defined password
     *
     * @param message
     * @param password
     * @returns {*}
     */
    decryptWithPassword(message, password) {
        let encrypted = sodium.from_base64(message),
            salt      = encrypted.slice(0, sodium.crypto_pwhash_SALTBYTES),
            text      = encrypted.slice(sodium.crypto_pwhash_SALTBYTES),
            key       = this._passwordToKey(password, salt);

        return sodium.to_string(this._decrypt(text, key));
    }
}