import ObjectClone from '../Utility/ObjectClone';

export default class AbstractConverter {

    /**
     * @param {BasicPasswordsClient} api
     * @param {String} type
     */
    constructor(api, type) {
        this._api = api;
        this._type = type;
    }

    /**
     * @param {String} string
     * @return {AbstractRevisionModel}
     * @api
     */
    fromJSON(string) {
        let data = JSON.parse(string);

        if(typeof data === 'object' && data instanceof Object) {
            return this.fromObject(data);
        }

        throw new Error('Invalid JSON string');
    }

    /**
     * @param {Object} object
     * @return {AbstractRevisionModel}
     * @api
     */
    fromObject(object) {
        let clone = ObjectClone.clone(object);

        if(clone.hasOwnProperty('created') && !(clone.created instanceof Date)) {
            clone.created = new Date(clone.created * 1e3);
        }
        if(clone.hasOwnProperty('updated') && !(clone.updated instanceof Date)) {
            clone.updated = new Date(clone.updated * 1e3);
        }
        if(clone.hasOwnProperty('edited') && !(clone.edited instanceof Date)) {
            clone.edited = new Date(clone.edited * 1e3);
        }

        return this.makeModel(clone);
    }

    /**
     *
     * @param properties
     * @return {*}
     */
    fromModel(model) {
        // @TODO actually clone models
        return model;
    }

    /**
     *
     * @param properties
     * @return {*}
     */
    makeModel(properties) {
        return this._api.getClass(`model.${this._type}`, properties, this._api);
    }

    /**
     * @param {Object} data
     * @return {Promise<AbstractRevisionModel>}
     * @api
     */
    async fromEncryptedData(data) {
        if(data.hasOwnProperty('cseType')) {
            if(data.cseType === 'CSEv1r1') {
                data = await this._api.getCseV1Encryption().decrypt(data, this._type);
            } else if(data.cseType !== 'none') {
                throw this._api.getClass('exception.encryption.unsupported', data, 'CSEv1r1');
            }
        }

        return this.fromObject(data);
    }

    /**
     * @param {AbstractRevisionModel} model
     * @return {Promise<Object>}
     * @api
     */
    async toEncryptedData(model) {
        let data = this.toObject(model);

        if(data.cseType === 'none') {
            return await this._api.getInstance('encryption.none').encrypt(data, this._type);
        }

        if(data.cseType === 'CSEv1r1') {
            return await this._api.getCseV1Encryption().encrypt(data, this._type);
        }

        return await this._api.getDefaultEncryption().encrypt(data, this._type);
    }

    /**
     * @param {AbstractRevisionModel} model
     * @return {Promise<Object>}
     * @api
     */
    async toApiObject(model) {
        let data       = await this.toEncryptedData(model),
            properties = model.getPropertyConfiguration();

        for(let key in data) {
            if(!properties.hasOwnProperty(key) || !properties[key].writeable) {
                delete data[key];
            }
        }

        let id = model.getId();
        if(typeof id === 'string' && id.length === 36) {
            data.id = id;
        }

        return data;
    }

    /**
     * @param {AbstractRevisionModel} model
     * @return {Object}
     * @api
     */
    toObject(model) {
        return model.getProperties();
    }

    /**
     * @param {AbstractRevisionModel} model
     * @return {String}
     * @api
     */
    toJSON(model) {
        return JSON.stringify(model);
    }
}