import sodium from "libsodium-wrappers";

export default class HashService {

    get HASH_SHA_1() {
        return 'SHA-1';
    }

    get HASH_SHA_256() {
        return 'SHA-256';
    }

    get HASH_SHA_384() {
        return 'SHA-384';
    }

    get HASH_SHA_512() {
        return 'SHA-512';
    }

    get HASH_BLAKE2B() {
        return 'BLAKE2b';
    }

    get HASH_BLAKE2B_224() {
        return 'BLAKE2b-224';
    }

    get HASH_BLAKE2B_256() {
        return 'BLAKE2b-256';
    }

    get HASH_BLAKE2B_384() {
        return 'BLAKE2b-384';
    }

    get HASH_BLAKE2B_512() {
        return 'BLAKE2b-512';
    }

    get HASH_ARGON2() {
        return 'Argon2';
    }

    constructor(classLoader) {
        this._ready = classLoader.getClass('state.boolean', false);

        sodium.ready.then(() => {this._ready.set(true);});
    }

    /**
     * Generate a hash of the given value with the given algorithm
     *
     * @param {String} value
     * @param {String} [algorithm=SHA-1]
     * @returns {Promise<string>}
     */
    async getHash(value, algorithm = 'SHA-1') {
        await this._ready.awaitTrue();

        if([this.HASH_SHA_1, this.HASH_SHA_256, this.HASH_SHA_384, this.HASH_SHA_512].indexOf(algorithm) !== -1) {
            return await this._makeShaHash(value, algorithm);
        } else if(algorithm.substr(0, 7) === this.HASH_BLAKE2B) {
            return this._makeBlake2bHash(algorithm, value);
        } else if(algorithm === this.HASH_ARGON2) {
            return sodium.crypto_pwhash_str(value, sodium.crypto_pwhash_OPSLIMIT_MIN, sodium.crypto_pwhash_MEMLIMIT_MIN);
        }
    }

    /**
     *
     * @param {String} value
     * @param {String} algorithm
     * @returns {Promise<String>}
     * @private
     */
    async _makeShaHash(value, algorithm) {
        let msgBuffer  = new TextEncoder('utf-8').encode(value),
            hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer);

        return sodium.to_hex(new Uint8Array(hashBuffer));
    }

    /**
     * @param {String} algorithm
     * @param {String} value
     * @returns {String}
     * @private
     */
    _makeBlake2bHash(algorithm, value) {
        let bytes = sodium.crypto_generichash_BYTES_MAX;
        if(algorithm.indexOf('-') !== -1) {
            bytes = algorithm.split('-')[1];
            if(sodium.crypto_generichash_BYTES_MAX < bytes) bytes = sodium.crypto_generichash_BYTES_MAX;
            if(sodium.crypto_generichash_BYTES_MIN > bytes) bytes = sodium.crypto_generichash_BYTES_MIN;
        }

        return sodium.to_hex(sodium.crypto_generichash(bytes, sodium.from_string(value)));
    }
}