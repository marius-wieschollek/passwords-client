export default class SettingRepository {

    /**
     *
     * @param {Api} api
     */
    constructor(api) {
        this._api = api;
        /** @type Cache **/
        this._cache = api.getInstance('cache.cache');
        /** @type SettingConverter **/
        this._converter = api.getInstance(`converter.setting`);
    }

    /**
     *
     * @return {AbstractRepository}
     */
    clearCache() {
        this._cache.clear();

        return this;
    }

    async findAll() {
        let request = await this._api.getRequest()
            .setPath(`1.0/settings/list`)
            .send();

        return this._converter.fromApiObject(request.getData());
    }

    async findByScope(scope) {
        let request = await this._api.getRequest()
            .setPath(`1.0/settings/list`)
            .setData({scopes: [scope]})
            .send();

        return this._converter.fromApiObject(request.getData());
    }

    async findByScopes(scopes) {
        let request = await this._api.getRequest()
            .setPath(`1.0/settings/list`)
            .setData({scopes})
            .send();

        return this._converter.fromApiObject(request.getData());
    }

    async findByName(name) {
        let request = await this._api.getRequest()
            .setPath(`1.0/settings/get`)
            .setData([name])
            .send();

        return this._converter.fromApiObject(request.getData());
    }

    async findByNames(names) {
        let request = await this._api.getRequest()
            .setPath(`1.0/settings/get`)
            .setData(names);
        return this._converter.fromApiObject(request.getData());
    }

    async set(setting) {
        let request = await this._api.getRequest()
            .setPath(`1.0/settings/set`)
            .setData(setting);
    }

    async reset(setting) {
        let request = await this._api.getRequest()
            .setPath(`1.0/settings/reset`)
            .setData(setting);
    }
}