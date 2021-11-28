import sodium from 'libsodium-wrappers';

export default class Encryption {

    constructor() {
        this.fields = {
            password: ['url', 'label', 'notes', 'password', 'username', 'customFields'],
            folder  : ['label'],
            tag     : ['label', 'color']
        };
        this._enabled = false;
        this._keys = {};
        this._current = '';
        this._legacyEncoding = false;
        this.ready();
    }

    /**
     *
     * @returns {Boolean}
     */
    get enabled() {
        return this._enabled;
    }

    /**
     *
     * @returns {Boolean}
     */
    get keys() {
        return Object.keys(this._keys);
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @returns {Promise<boolean>}
     */
    async ready() {
        await sodium.ready;
    }

    /**
     * Returns true if the user has base64 encoded properties
     *
     * @return {Boolean}
     */
    hasLegacyEncoding() {
        return this._legacyEncoding;
    }

    /**
     * Encrypts an object
     *
     * @param object
     * @param type
     * @returns {{_encrypted}|*}
     */
    encryptObject(object, type) {
        if(!this._enabled) throw new Error('Encryption not available');
        if(!this.fields.hasOwnProperty(type)) throw new Error('Invalid object type');
        if(object.hasOwnProperty('_encrypted') && object._encrypted) return object;

        let fields = this.fields[type],
            key    = this._getKey(this._current);

        for(let i = 0; i < fields.length; i++) {
            let field = fields[i],
                data  = object[field];

            if(data === null || data.length === 0) continue;
            object[field] = this.encryptString(data, key);
        }

        object.cseType = 'CSEv1r1';
        object.cseKey = this._current;
        object._encrypted = true;

        return object;
    }

    /**
     * Decrypts an object
     *
     * @param object
     * @param type
     * @returns {{_encrypted}|*}
     */
    decryptObject(object, type) {
        if(!this._enabled) throw new Error('Encryption not available');
        if(!this.fields.hasOwnProperty(type)) throw new Error('Invalid object type');
        if(object.cseType !== 'CSEv1r1') throw new Error('Unsupported encryption type');
        if(object.hasOwnProperty('_encrypted') && !object._encrypted) return object;

        let fields = this.fields[type],
            key    = this._getKey(object.cseKey);

        for(let i = 0; i < fields.length; i++) {
            let field = fields[i],
                data  = object[field];

            if(data === null || data.length === 0) continue;
            object[field] = this.decryptString(data, key);
        }

        object._encrypted = false;

        return object;
    }

    /**
     * Encrypts the message with the user defined password
     *
     * @param message
     * @param password
     * @returns {*}
     */
    encryptWithPassword(message, password) {
        let salt      = this._generateRandom(sodium.crypto_pwhash_SALTBYTES),
            key       = this._passwordToKey(password, salt),
            encrypted = this.encrypt(message, key);

        return sodium.to_hex(new Uint8Array([...salt, ...encrypted]));
    }

    /**
     * Decrypts the message with the user defined password
     *
     * @param message
     * @param password
     * @returns {*}
     */
    decryptWithPassword(message, password) {
        let encrypted = sodium.from_hex(message),
            salt      = encrypted.slice(0, sodium.crypto_pwhash_SALTBYTES),
            text      = encrypted.slice(sodium.crypto_pwhash_SALTBYTES),
            key       = this._passwordToKey(password, salt);

        return sodium.to_string(this.decrypt(text, key));
    }

    /**
     * Encrypt the message with the given key and return a hex encoded string
     *
     * @param message
     * @param key
     * @returns {String}
     */
    encryptString(message, key) {
        return sodium.to_hex(this.encrypt(message, key));
    }

    /**
     * Encrypt the message with the given key
     *
     * @param message
     * @param key
     * @returns {Uint8Array}
     */
    encrypt(message, key) {
        let nonce = this._generateRandom(sodium.crypto_secretbox_NONCEBYTES);

        return new Uint8Array([...nonce, ...sodium.crypto_secretbox_easy(message, nonce, key)]);
    }

    /**
     * Decrypt the hex or base64 encoded message with the given key
     *
     * @param encodedString
     * @param key
     * @returns {String}
     */
    decryptString(encodedString, key) {
        try {
            let encryptedString = sodium.from_hex(encodedString);
            return sodium.to_string(this.decrypt(encryptedString, key));
        } catch(e) {
            let encryptedString = sodium.from_base64(encodedString);
            let result = sodium.to_string(this.decrypt(encryptedString, key));
            this._legacyEncoding = true;
            return result;
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Decrypt the message with the given key
     *
     * @param encrypted
     * @param key
     * @returns {Uint8Array}
     */
    decrypt(encrypted, key) {
        if(encrypted.length < sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES) throw new Error('Invalid encrypted text length');

        let nonce      = encrypted.slice(0, sodium.crypto_secretbox_NONCEBYTES),
            ciphertext = encrypted.slice(sodium.crypto_secretbox_NONCEBYTES);

        return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Generate a challenge solution with the user provided password
     * and the server provided salts
     *
     * @param salts
     * @param password
     * @returns {String}
     */
    solveChallenge(password, salts) {
        if(password.length < 12) throw new Error('Password is too short');
        if(password.length > 128) throw new Error('Password is too long');

        let passwordSalt     = sodium.from_hex(salts[0]),
            genericHashKey   = sodium.from_hex(salts[1]),
            passwordHashSalt = sodium.from_hex(salts[2]),
            genericHash      = sodium.crypto_generichash(
                sodium.crypto_generichash_BYTES_MAX,
                new Uint8Array([...sodium.from_string(password), ...passwordSalt]),
                genericHashKey
            );

        let passwordHash = sodium.crypto_pwhash(
            sodium.crypto_box_SEEDBYTES,
            genericHash,
            passwordHashSalt,
            sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
            sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
            sodium.crypto_pwhash_ALG_DEFAULT
        );


        return sodium.to_hex(passwordHash);
    }

    /**
     * Create the salts and the secret for the server
     * using the user provided password
     *
     * @param password
     * @returns {{salts: *[], secret: *}}
     */
    createChallenge(password) {
        if(password.length < 12) throw new Error('Password is too short');
        if(password.length > 128) throw new Error('Password is too long');

        let passwordSalt   = this._generateRandom(256),
            genericHashKey = this._generateRandom(sodium.crypto_generichash_KEYBYTES_MAX),
            genericHash    = sodium.crypto_generichash(
                sodium.crypto_generichash_BYTES_MAX,
                new Uint8Array([...sodium.from_string(password), ...passwordSalt]),
                genericHashKey
            );

        let passwordHashSalt = this._generateRandom(sodium.crypto_pwhash_SALTBYTES),
            passwordHash     = sodium.crypto_pwhash(
                sodium.crypto_box_SEEDBYTES,
                genericHash,
                passwordHashSalt,
                sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
                sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
                sodium.crypto_pwhash_ALG_DEFAULT
            );

        return {
            salts : [
                sodium.to_hex(passwordSalt),
                sodium.to_hex(genericHashKey),
                sodium.to_hex(passwordHashSalt)
            ],
            secret: sodium.to_hex(passwordHash)
        };
    }

    /**
     * Decrypt and activate the keychain
     *
     * @param keychainText
     * @param password
     */
    setKeychain(keychainText, password) {
        let encrypted;
        try {
            encrypted = sodium.from_hex(keychainText);
        } catch(e) {
            encrypted = sodium.from_base64(keychainText);
            this._legacyEncoding = true;
        }

        let salt     = encrypted.slice(0, sodium.crypto_pwhash_SALTBYTES),
            text     = encrypted.slice(sodium.crypto_pwhash_SALTBYTES),
            key      = this._passwordToKey(password, salt),
            keychain = JSON.parse(sodium.to_string(this.decrypt(text, key)));

        this._current = keychain.current;
        for(let id in keychain.keys) {
            if(keychain.keys.hasOwnProperty(id)) {
                this._keys[id] = sodium.from_hex(keychain.keys[id]);
            }
        }

        this._enabled = true;
    }

    /**
     * Remove the current keychain
     */
    unsetKeychain() {
        this._enabled = false;
        this._keys = {};
        this._current = '';
    }

    /**
     * Add a new key to the keychain and return the full keychain
     *
     * @param password
     * @param addKey
     * @returns {*}
     */
    getKeychain(password, addKey = false) {
        if(this._enabled === false) {
            this._keys = {};
        }

        if(addKey || this._current.length === 0) {
            this._current = this.getUuid();
            this._keys[this._current] = this._generateRandom(sodium.crypto_secretbox_KEYBYTES);
            this._enabled = true;
        }

        let keychain = {
            keys   : {},
            current: this._current
        };

        for(let id in this._keys) {
            if(this._keys.hasOwnProperty(id)) {
                keychain.keys[id] = sodium.to_hex(this._keys[id]);
            }
        }

        let salt      = this._generateRandom(sodium.crypto_pwhash_SALTBYTES),
            key       = this._passwordToKey(password, salt),
            encrypted = this.encrypt(JSON.stringify(keychain), key);

        return sodium.to_hex(new Uint8Array([...salt, ...encrypted]));
    }

    /**
     * Create a uuidv4
     *
     * @returns {String}
     */
    getUuid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    /**
     *
     * @param uuid
     * @returns {Uint8Array}
     * @private
     */
    _getKey(uuid) {
        if(this._keys.hasOwnProperty(uuid)) {
            return this._keys[uuid];
        }

        throw new Error('Unknown CSE key id');
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

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param length
     * @returns {Uint8Array}
     * @private
     */
    _generateRandom(length) {
        let array = new Uint8Array(length);
        window.crypto.getRandomValues(array);

        return array;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Generate a hash of the given text with the given algorithm
     *
     * @param value
     * @param algorithm
     * @returns {Promise<string>}
     */
    async getHash(value, algorithm = 'SHA-1') {
        if(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].indexOf(algorithm) !== -1) {
            let msgBuffer  = new TextEncoder('utf-8').encode(value),
                hashBuffer = await
                    crypto.subtle.digest(algorithm, msgBuffer);
            return sodium.to_hex(new Uint8Array(hashBuffer));
        } else if(algorithm.substr(0, 7) === 'BLAKE2b') {
            let bytes = sodium.crypto_generichash_BYTES_MAX;
            if(algorithm.indexOf('-') !== -1) {
                bytes = algorithm.split('-')[1];
                if(sodium.crypto_generichash_BYTES_MAX < bytes) bytes = sodium.crypto_generichash_BYTES_MAX;
                if(sodium.crypto_generichash_BYTES_MIN > bytes) bytes = sodium.crypto_generichash_BYTES_MIN;
            }

            return sodium.to_hex(sodium.crypto_generichash(bytes, sodium.from_string(value)));
        } else if(algorithm === 'Argon2') {
            return sodium.crypto_pwhash_str(value, sodium.crypto_pwhash_OPSLIMIT_MIN, sodium.crypto_pwhash_MEMLIMIT_MIN);
        }
    }
}