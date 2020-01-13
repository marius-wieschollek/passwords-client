import Password from '../Model/Password';

export default class PasswordRepository {

    /**
     *
     * @param {Api} api
     * @param {Cache} cache
     */
    constructor(api, cache) {
        this._api = api;
        this._cache = cache;
    }

    /**
     *
     * @return {PasswordRepository}
     */
    clearCache() {
        this._cache.clear();

        return this;
    }

    /**
     *
     * @param {Password} password
     * @returns {Promise<Password>}
     */
    async create(password) {
    }

    /**
     *
     * @param {Password} password
     * @returns {Promise<Password>}
     */
    async update(password) {

    }

    /**
     *
     * @param {Password} password
     * @returns {Promise<Password>}
     */
    async delete(password) {

    }

    /**
     *
     * @param id
     * @returns {Promise<Password>}
     */
    async findById(id) {
        if(this._cache.has(id)) {
            return this._cache.get(id);
        }

        let request = this._api.getRequest()
            .setPath('api/1.0/password/show')
            .setData({id});

        let response = await request.send(),
            password = await this._dataToModel(response.getData());

        this._cache.set(password.getId(), password, 'password');

        return password;
    }

    /**
     *
     * @returns {Promise<[Password]>}
     */
    async findAll() {
        if(this._cache.has('passwords.list')) {
            return this._cache.getByType('password');
        }

        let request = this._api.getRequest()
            .setPath('api/1.0/password/list');

        let response = await request.send();
        let passwords = response.getData();

        let result = [];
        for(let data of passwords) {
            try {
                result.push(await this._dataToModel(data));
            } catch(e) {
                console.error(e, data);
            }
        }
        this._cache.set('passwords.list', true);

        return result;
    }

    /**
     *
     * @param {Object} data
     * @returns {Promise<Password>}
     * @private
     */
    async _dataToModel(data) {
        if(data.cseType === 'CSEv1r1') {
            data = await this._api.getCseV1Encryption().decrypt(data, 'password');
        } else if(data.cseType !== 'none') {
            throw new this._api.getClass('exception.encryption', data.id, data.cseType);
        }

        let password = this._api.getClass('model.password', this._api, data);
        this._cache.set(password.getId(), password, 'password');

        return password
    }
}