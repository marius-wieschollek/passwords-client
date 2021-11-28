import sodium from 'libsodium-wrappers';
import { v4 as uuid } from 'uuid';

export default class CSEv1Keychain {

    /**
     *
     * @param {BasicClassLoader} classLoader
     * @param {String} keychain
     * @param {String} password
     */
    constructor(classLoader, keychain = null, password = null) {
        this._keys = {};
        this._current = null;
        this._enabled = classLoader.getClass('state.boolean', false);
        this._password = password;
        this._classLoader = classLoader;

        if(keychain !== null) {
            sodium.ready.then(() => {
                this.import(keychain);
            });
        }
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    async ready() {
        return await this._enabled.awaitTrue();
    }

    /**
     * Set the password to encrypt/decrypt the keychain
     * @param value
     * @returns {CSEv1Keychain}
     */
    setPassword(value) {
        this._password = value;

        return this;
    }

    /**
     * Get a key by id
     *
     * @param id
     * @returns {String}
     */
    getKey(id) {
        if(this._keys.hasOwnProperty(id)) {
            return this._keys[id];
        }

        throw this._classLoader.getClass('exception.encryption.key.missing', id);
    }

    /**
     * Get the current key
     *
     * @returns {String}
     */
    getCurrentKey() {
        return this.getKey(this._current);
    }

    /**
     * Get the current key
     *
     * @returns {(String|null)}
     */
    getCurrentKeyId() {
        return this._current;
    }

    /**
     * Decrypt the given keychain and apply it
     *
     * @param {String} keychainText
     */
    import(keychainText) {
        let encrypted;
        try {
            encrypted = sodium.from_hex(keychainText);
        } catch(e) {
            encrypted = sodium.from_base64(keychainText);
        }

        let salt      = encrypted.slice(0, sodium.crypto_pwhash_SALTBYTES),
            text      = encrypted.slice(sodium.crypto_pwhash_SALTBYTES),
            key       = this._passwordToKey(this._password, salt),
            keychain  = JSON.parse(sodium.to_string(this._decrypt(text, key)));

        for(let id in keychain.keys) {
            if(keychain.keys.hasOwnProperty(id)) {
                this._keys[id] = sodium.from_hex(keychain.keys[id]);
            }
        }
        this._current = keychain.current;
        this._enabled.set(true);

        return this;
    }

    /**
     * Export the keychain as encrypted string
     *
     * @returns {String}
     */
    export() {
        let keychain = {
            keys   : {},
            current: this._current
        };

        for(let id in this._keys) {
            if(this._keys.hasOwnProperty(id)) {
                keychain.keys[id] = sodium.to_hex(this._keys[id]);
            }
        }

        let salt      = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES),
            key       = this._passwordToKey(this._password, salt),
            encrypted = this._encrypt(JSON.stringify(keychain), key);

        return sodium.to_hex(new Uint8Array([...salt, ...encrypted]));
    }

    /**
     * Add a new key to the keychain and set it as current
     */
    update() {
        let uuid = uuid();
        this._keys[uuid] = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
        this._current = uuid;
        this._enabled.set(true);
    }

    /**
     * Encrypt the message with the given key
     *
     * @param message
     * @param key
     * @returns {Uint8Array}
     */
    _encrypt(message, key) {
        let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

        return new Uint8Array([...nonce, ...sodium.crypto_secretbox_easy(message, nonce, key)]);
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Decrypt the message with the given key
     *
     * @param encrypted
     * @param key
     * @returns {Uint8Array}
     */
    _decrypt(encrypted, key) {
        let expectedLength = sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES;
        if(encrypted.length < expectedLength) throw this._classLoader.getClass('exception.encryption.text.length', encrypted.length, expectedLength);

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
    _passwordToKey(password, salt) {
        return sodium.crypto_pwhash(
            sodium.crypto_box_SEEDBYTES,
            password,
            salt,
            sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
            sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
            sodium.crypto_pwhash_ALG_DEFAULT
        );
    }
}