export default class SettingConverter {

    /**
     * @param {Api} api
     */
    constructor(api) {
        this._api = api;
        /** @type {Cache} **/
        this._cache = api.getInstance('cache.cache');
    }

    /**
     *
     * @param {String} json
     * @return {(SettingCollection|Setting)}
     */
    fromJSON(json) {
        let object = JSON.parse(json);

        if(Array.isArray(object)) {
            return this.fromArray(object);
        }

        return this.fromObject(object);
    }

    /**
     *
     * @param {Object} object
     * @return {Setting}
     */
    fromObject(object) {
        let key = `setting.${object.scope}.${object.name}`;

        if(this._cache.has(key)) {
            /** @type {Setting} **/
            let setting = this._cache.get(key);
            if(setting.getValue() !== object.value) setting.setValue(object.value);

            return setting;
        }

        let setting = this._api.getClass('model.setting', object.name, object.value, object.scope);
        this._cache.set(key, setting, 'setting.model');

        return setting;
    }

    /**
     *
     * @param {Object[]} array
     * @return {SettingCollection}
     */
    fromArray(array) {
        let settings = [];

        for(let setting of array) {
            settings.push(this.fromObject(setting));
        }

        return this._api.getClass('collection.setting', settings);
    }

    /**
     *
     * @param {Object} object
     * @return {SettingCollection}
     */
    fromApiObject(object) {
        let settings = [];

        for(let key in object) {
            if(!object.hasOwnProperty(key)) continue;
            let index = key.indexOf('.'),
                scope = key.substr(0, index),
                name  = key.substring(index + 1),
                value = object[key];

            settings.push(this.fromObject({scope, name, value}));
        }

        return this._api.getClass('collection.setting', settings);
    }

    /**
     * @param {SettingCollection} collection
     * @return {Object[]}
     */
    toApiObject(collection) {
        let object = {};

        for(let setting of collection) {
            let key = `${setting.scope}.${setting.name}`;
            object[key] = setting.value;
        }

        return object;
    }

    /**
     * @param {SettingCollection} collection
     * @return {Object[]}
     */
    toArray(collection) {
        let array = [];

        for(let field of collection) {
            array.push(this.toObject(field));
        }

        return array;
    }

    /**
     * @param {Setting} setting
     * @return {Object}
     */
    toObject(setting) {
        return {
            scope: setting.scope,
            name : setting.name,
            value: setting.value
        };
    }

    /**
     * @param {Setting} setting
     * @return {String}
     */
    toJSON(setting) {
        return JSON.stringify(setting);
    }
}