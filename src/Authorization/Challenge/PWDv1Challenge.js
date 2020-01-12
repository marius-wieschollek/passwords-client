import sodium from 'libsodium-wrappers';

export default class PWDv1Challenge {

    constructor(data) {
        this._salts = null;
        if(data.hasOwnProperty('salts')) {
            this._salts = data.salts;
        }
        this._password = null;
    }

    /**
     *
     * @returns {null}
     */
    getPassword() {
        return this._password;
    }

    /**
     *
     * @param value
     * @returns {PWDv1Challenge}
     */
    setPassword(value) {
        this._password = value;

        return this;
    }

    /**
     * Generate a challenge solution with the user provided password
     * and the server provided salts
     *
     * @returns {string}
     */
    solve() {
        if(this._password.length < 12) throw new Error('Password is too short');
        if(this._password.length > 128) throw new Error('Password is too long');
        let salts = this._salts;

        let passwordSalt     = sodium.from_hex(salts[0]),
            genericHashKey   = sodium.from_hex(salts[1]),
            passwordHashSalt = sodium.from_hex(salts[2]),
            genericHash      = sodium.crypto_generichash(
                sodium.crypto_generichash_BYTES_MAX,
                new Uint8Array([...sodium.from_string(this._password), ...passwordSalt]),
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
     * @returns {{salts: *[], secret: *}}
     */
    create() {
        if(this._password.length < 12) throw new Error('Password is too short');
        if(this._password.length > 128) throw new Error('Password is too long');

        let passwordSalt   = this._generateRandom(256),
            genericHashKey = this._generateRandom(sodium.crypto_generichash_KEYBYTES_MAX),
            genericHash    = sodium.crypto_generichash(
                sodium.crypto_generichash_BYTES_MAX,
                new Uint8Array([...sodium.from_string(this._password), ...passwordSalt]),
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
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param length
     * @returns {Uint8Array}
     * @private
     * @deprecated
     */
    _generateRandom(length) {
        let array = new Uint8Array(length);
        window.crypto.getRandomValues(array);

        return array;
    }
}