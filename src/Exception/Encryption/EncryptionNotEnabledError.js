export default class EncryptionNotEnabledError extends Error {
    constructor() {
        super(`CSE Encryption not enabled or ready`);
    }
}