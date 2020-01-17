export default class EncryptionTypeNotSupported extends Error {

    /**
     *
     * @return {String}
     */
    get objectId() {
        return this._objectId;
    }

    /**
     *
     * @return {String}
     */
    get cseType() {
        return this._cseType;
    }

    /**
     *
     * @param {String} objectId
     * @param {String} cseType
     */
    constructor(objectId, cseType) {
        super(`The encryption type ${cseType} used for ${objectId} is not supported by this client`);
        this._objectId = objectId;
        this._cseType = cseType;
    }
}