export default class EncryptionTypeNotSupported extends Error {

    /**
     *
     * @return {string}
     */
    get objectId() {
        return this._objectId;
    }

    /**
     *
     * @return {string}
     */
    get cseType() {
        return this._cseType;
    }

    /**
     *
     * @param {string} objectId
     * @param {string} cseType
     */
    constructor(objectId, cseType) {
        super(`The encryption type ${cseType} used for ${objectId} is not supported by this client`);
        this._objectId = objectId;
        this._cseType = cseType;
    }
}