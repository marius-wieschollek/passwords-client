export default class InvalidEncryptedTextLength extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'InvalidEncryptedTextLength';
    }

    /**
     * @param {Number} length
     * @param {Number} expectedLength
     */
    constructor(length, expectedLength) {
        super(`Invalid encrypted text length. Expected ${expectedLength}, got ${length} instead.`);
    }
}