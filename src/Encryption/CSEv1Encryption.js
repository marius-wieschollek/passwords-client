import sodium from 'libsodium-wrappers';
import BooleanState from '../State/BooleanState';

export default class CSEv1Encryption {

    constructor() {
        this.fields = {
            password: ['url', 'label', 'notes', 'password', 'username', 'customFields'],
            folder  : ['label'],
            tag     : ['label', 'color']
        };
        this._enabled = new BooleanState(false);
        this._keychain = null;
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    async ready() {
        await sodium.ready && await this._enabled.awaitTrue();
    }

    /**
     * Encrypts an object
     *
     * @param {Object} object
     * @param {String} type
     * @returns {Object}
     */
    async encrypt(object, type) {
        // TODO custom errors here
        if(!this.fields.hasOwnProperty(type)) throw new Error('Invalid object type');
        await this.ready();

        let fields = this.fields[type],
            key    = this._keychain.getCurrentKey();

        for(let i = 0; i < fields.length; i++) {
            let field = fields[i],
                data  = object[field];

            if(data === null || data.length === 0) continue;
            object[field] = this._encryptString(data, key);
        }

        object.cseType = 'CSEv1r1';
        object.cseKey = this._keychain.getCurrentKeyId();

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
        // TODO custom errors here
        if(!this.fields.hasOwnProperty(type)) throw new Error('Invalid object type');
        if(object.cseType !== 'CSEv1r1') throw new Error('Unsupported encryption type');
        await this.ready();

        let fields = this.fields[type],
            key    = this._keychain.getKey(object.cseKey);

        for(let i = 0; i < fields.length; i++) {
            let field = fields[i],
                data  = object[field];

            if(data === null || data.length === 0) continue;
            object[field] = this._decryptString(data, key);
        }

        return object;
    }

    /**
     * Encrypt the message with the given key and return a hex encoded string
     *
     * @param {String} message
     * @param {Uint8Array} key
     * @returns {String}
     * @private
     */
    _encryptString(message, key) {
        return sodium.to_hex(this._encrypt(message, key));
    }

    /**
     * Decrypt the hex or base64 encoded message with the given key
     *
     * @param {String} encodedString
     * @param {Uint8Array} key
     * @returns {String}
     * @private
     */
    _decryptString(encodedString, key) {
        try {
            let encryptedString = sodium.from_hex(encodedString);
            return sodium.to_string(this._decrypt(encryptedString, key));
        } catch(e) {
            let encryptedString = sodium.from_base64(encodedString);
            return sodium.to_string(this._decrypt(encryptedString, key));
        }
    }

    /**
     * Encrypt the message with the given key
     *
     * @param {Uint8Array} message
     * @param {Uint8Array} key
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

    /**
     * Decrypt and activate the keychain
     *
     * @param {CSEv1Keychain} keychain
     * @private
     */
    setKeychain(keychain) {
        this._keychain = keychain;

        keychain
            .ready()
            .then(() => {
                this._enabled.set(true);
            });
    }

    /**
     * Remove the current keychain
     */
    unsetKeychain() {
        this._enabled.set(false);
        this._keychain = null;
    }
}