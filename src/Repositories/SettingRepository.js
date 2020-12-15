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

    /**
     * @returns {Promise<SettingCollection>}
     */
    async findAll() {
        let response = await this._api.getRequest()
                                 .setPath(`1.0/settings/list`)
                                 .send();

        return this._converter.fromApiObject(response.getData());
    }

    /**
     * @param {String} scope
     * @returns {Promise<SettingCollection>}
     */
    async findByScope(scope) {
        let response = await this._api.getRequest()
                                 .setPath(`1.0/settings/list`)
                                 .setData({scopes: [scope]})
                                 .send();

        return this._converter.fromApiObject(response.getData());
    }

    /**
     * @param {String[]} scopes
     * @returns {Promise<SettingCollection>}
     */
    async findByScopes(scopes) {
        let response = await this._api.getRequest()
                                 .setPath(`1.0/settings/list`)
                                 .setData({scopes})
                                 .send();

        return this._converter.fromApiObject(response.getData());
    }

    /**
     * @param {String} name
     * @returns {Promise<SettingCollection>}
     */
    async findByName(name) {
        let response = await this._api.getRequest()
                                 .setPath(`1.0/settings/get`)
                                 .setData([name])
                                 .send();

        return this._converter.fromApiObject(response.getData());
    }

    /**
     * @param {String[]} names
     * @returns {Promise<SettingCollection>}
     */
    async findByNames(names) {
        let response = await this._api.getRequest()
                                 .setPath(`1.0/settings/get`)
                                 .setData(names)
                                 .send();
        return this._converter.fromApiObject(response.getData());
    }

    /**
     *
     * @param {Setting} setting
     * @returns {Promise<void>}
     */
    async set(setting) {
        let key = `${setting.getScope()}.${setting.getName()}`,
            data = {};
        data[key] = setting.getValue();

        let response =
                await this._api.getRequest()
                          .setPath(`1.0/settings/set`)
                          .setData(data)
                          .send();
    }

    /**
     *
     * @param {Setting} setting
     * @returns {Promise<void>}
     */
    async reset(setting) {
        let key = `${setting.getScope()}.${setting.getName()}`;
        let response =
                await this._api.getRequest()
                          .setPath(`1.0/settings/reset`)
                          .setData([key])
                          .send();
    }

    /**
     *
     * @param {Setting} setting
     * @returns {Promise<void>}
     */
    update(setting) {
        return this.set(setting);
    }

    /**
     *
     * @param {Setting} setting
     * @returns {Promise<void>}
     */
    create(setting) {
        return this.set(setting);
    }
}