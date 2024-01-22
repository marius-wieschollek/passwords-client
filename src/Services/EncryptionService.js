import sodium from 'libsodium-wrappers';

export default class EncryptionService {

    /**
     *
     * @param {BasicClassLoader} classLoader
     */
    constructor(classLoader) {
        this._ready = classLoader.getClass('state.boolean', false);
        this._classLoader = classLoader;

        sodium.ready.then(() => {this._ready.set(true);});
    }

    /**
     *
     * @returns {Promise<Boolean>}
     */
    async ready() {
        await this._ready.awaitTrue();
        return true;
    }

    /**
     * @returns {Boolean}
     */
    enabled() {
        return this._ready.get();
    }

    /**
     * Encrypt the message with the given key and return a hex encoded string
     *
     * @param {String} message
     * @param {String} passphrase
     * @returns {String}
     */
    encrypt(message, passphrase) {
        if(!this.enabled()) throw this._classLoader.getClass('exception.encryption.enabled');

        let {key, salt} = this._passwordToKey(passphrase);
        let encrypted = this._encrypt(message, key);

        return sodium.to_hex(new Uint8Array([...salt, ...encrypted]));
    }

    /**
     * Decrypt the hex encoded message with the given key
     *
     * @param {String} message
     * @param {Uint8Array} passphrase
     * @returns {String}
     */
    decrypt(message, passphrase) {
        if(!this.enabled()) throw this._classLoader.getClass('exception.encryption.enabled');

        let encodedString = sodium.from_hex(message),
            salt = encodedString.slice(0, sodium.crypto_pwhash_SALTBYTES),
            text = encodedString.slice(sodium.crypto_pwhash_SALTBYTES),
            {key, }  = this._passwordToKey(passphrase, salt);
        return sodium.to_string(this._decrypt(text, key));
    }


    /**
     * Encrypt the message with the given key and return a hex encoded string
     *
     * @param {String} message
     * @param {String} passphrase
     * @returns {Promise<String>}
     */
    async encryptAsync(message, passphrase) {
        await this.ready();
        return this.encrypt(message, passphrase);
    }


    /**
     Decrypt the hex encoded message with the given key

     @param {String} message
     @param {Uint8Array} passphrase
     * @returns {Promise<String>}
     */
    async decryptAsync(message, passphrase) {
        await this.ready();
        return this.decrypt(message, passphrase);
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
     * @param {String} password
     * @param {String} salt
     * @return {{salt: *, key: *}}
     * @private
     */
    _passwordToKey(password, salt = null) {
        if(salt === null) {
            salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
        }

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