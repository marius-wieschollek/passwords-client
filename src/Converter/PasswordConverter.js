import AbstractConverter from './AbstractConverter';
import ObjectClone from '../Utility/ObjectClone';

export default class PasswordConverter extends AbstractConverter {

    /**
     * @param {BasicPasswordsClient} client
     */
    constructor(client) {
        super(client, 'password');
        /** @type {CustomFieldConverter} **/
        this._customFieldConverter = this._client.getInstance('converter.field');
        this._hashService = /** @type {HashService} **/ this._client.getInstance('service.hash');
    }

    /**
     * @param {Object} object
     * @return {AbstractRevisionModel}
     */
    fromObject(object) {
        let clone = ObjectClone.clone(object);

        if(typeof clone.customFields === 'string') {

            try {
                if(clone.customFields.length !== 0) {
                    clone.customFields = this._customFieldConverter.fromJSON(clone.customFields);
                } else {
                    clone.customFields = this._customFieldConverter.fromArray([]);
                }
            } catch(e) {
                this._client.getLogger().warning('Could not read custom fields', {password: object});
                this._client.getLogger().exception(e, {password: object});
                clone.customFields = this._customFieldConverter.fromArray([]);
            }
        } else {
            clone.customFields = this._customFieldConverter.fromArray([]);
        }

        if(clone.hasOwnProperty('created') && !(clone.created instanceof Date)) {
            clone.created = new Date(clone.created * 1e3);
        }
        if(clone.hasOwnProperty('updated') && !(clone.updated instanceof Date)) {
            clone.updated = new Date(clone.updated * 1e3);
        }
        if(clone.hasOwnProperty('edited') && !(clone.edited instanceof Date)) {
            clone.edited = new Date(clone.edited * 1e3);
        }

        return this._client.getClass(`model.${this._type}`, clone);
    }

    /**
     *
     * @param {(Password|AbstractRevisionModel)} model
     * @returns {Promise<void>}
     */
    async toObject(model) {
        let data = super.toObject(model);

        data.customFields = this._customFieldConverter.toJSON(model.getCustomFields());
        data.hash = await this._hashService.getHash(model.getPassword(), this._hashService.HASH_SHA_1);

        return data;
    }
}