import AbstractConverter from './AbstractConverter';
import ObjectClone from '../Utility/ObjectClone';

export default class PasswordConverter extends AbstractConverter {

    /**
     * @param {Api} api
     */
    constructor(api) {
        super(api, 'password');
        /** @type CustomFieldConverter **/
        this._customFieldConverter = this._api.getInstance('converter.field');
    }

    /**
     * @param {Object} object
     * @return {AbstractRevisionModel}
     */
    fromObject(object) {
        let clone = ObjectClone.clone(object);

        if(typeof clone.customFields === 'string') {
            clone.customFields = this._customFieldConverter.fromJSON(clone.customFields);
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

        return this._api.getClass(`model.${this._type}`, clone, this._api);
    }
}