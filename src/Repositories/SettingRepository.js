export default class SettingRepository {

    /**
     *
     * @param {Api} api
     */
    constructor(api) {
        this._api = api;
        /** @type SettingConverter **/
        this._converter = api.getInstance(`converter.setting`);
    }

    async findAll() {
        let response = await this._api.getRequest()
            .setPath(`1.0/settings/list`)
            .send();

        return this._converter.fromApiObject(response.getData());
    }

    async findByScope(scope) {
        let response = await this._api.getRequest()
            .setPath(`1.0/settings/list`)
            .setData({scopes: [scope]})
            .send();

        return this._converter.fromApiObject(response.getData());
    }

    async findByScopes(scopes) {
        let response = await this._api.getRequest()
            .setPath(`1.0/settings/list`)
            .setData({scopes})
            .send();

        return this._converter.fromApiObject(response.getData());
    }

    async findByName(name) {
        let response = await this._api.getRequest()
            .setPath(`1.0/settings/get`)
            .setData([name])
            .send();

        return this._converter.fromApiObject(response.getData());
    }

    async findByNames(names) {
        let response = await this._api.getRequest()
            .setPath(`1.0/settings/get`)
            .setData(names)
            .send();
        return this._converter.fromApiObject(response.getData());
    }

    async set(setting) {
        let response = await this._api.getRequest()
            .setPath(`1.0/settings/set`)
            .setData(setting)
            .send();
    }

    async reset(setting) {
        let response = await this._api.getRequest()
            .setPath(`1.0/settings/reset`)
            .setData(setting)
            .send();
    }
}