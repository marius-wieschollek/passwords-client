export default class SettingRepository {

    /**
     *
     * @param {Api} api
     */
    constructor(api) {
        this._api = api;
        /** @type Cache **/
        this._cache = api.getInstance('cache.cache');
        /** @type AbstractConverter **/
        //this._converter = api.getInstance(`converter.setting`);
    }

    /**
     *
     * @return {AbstractRepository}
     */
    clearCache() {
        this._cache.clear();

        return this;
    }

    findAll() {
        let request = this._api.getRequest()
            .setPath(`1.0/settings/list`);
    }

    findByScope(scope) {
        let request = this._api.getRequest()
            .setPath(`1.0/settings/list`)
            .setData([scope]);
    }

    findByScopes(scopes) {
        let request = this._api.getRequest()
            .setPath(`1.0/settings/list`)
            .setData([scopes]);
    }

    async findByName(name) {
        let data = await this._api.getRequest()
            .setPath(`1.0/settings/get`)
            .setData([name])
            .send();
    }

    findByNames(names) {
        let request = this._api.getRequest()
            .setPath(`1.0/settings/get`)
            .setData(names);
    }

    set(setting) {
        let request = this._api.getRequest()
            .setPath(`1.0/settings/set`)
            .setData(setting);
    }

    reset(setting) {
        let request = this._api.getRequest()
            .setPath(`1.0/settings/reset`)
            .setData(setting);
    }

    /**
     *
     * @param {Object} data
     * @returns {Promise<AbstractRevisionModel>}
     * @private
     */
    async _dataToModel(data) {

        return model;
    }
}