import sodium from 'libsodium-wrappers';
import uuid from 'uuidv4';
import BooleanState from '../../State/BooleanState';

export default class CSEv1Keychain {

    constructor(keychain = null, password = null) {
        this._keys = {};
        this._current = null;
        this._enabled = new BooleanState(false);
        this._password = password;

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
     * @returns {string}
     */
    getKey(id) {
        if(this._keys.hasOwnProperty(id)) {
            return this._keys[id];
        }

        throw new Error('Unknown CSE key id');
    }

    /**
     * Get the current key
     *
     * @returns {string}
     */
    getCurrentKey() {
        return this.getKey(this._current);
    }

    /**
     * Get the current key
     *
     * @returns {string|null}
     */
    getCurrentKeyId() {
        return this._current;
    }

    /**
     * Decrypt the given keychain and apply it
     *
     * @param {string} keychainText
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
     * @returns {string}
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