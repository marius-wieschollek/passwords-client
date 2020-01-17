export default class AbstractRepository {

    /**
     *
     * @param {Api} api
     * @param {Cache} cache
     */
    constructor(api, cache, type) {
        this._api = api;
        this._cache = cache;
        this._type = type;
    }

    /**
     *
     * @return {AbstractRepository}
     */
    clearCache() {
        this._cache.clear();

        return this;
    }

    /**
     *
     * @param {Tag} model
     * @returns {Promise<AbstractModel>}
     */
    async create(model) {
    }

    /**
     *
     * @param {AbstractModel} model
     * @returns {Promise<AbstractModel>}
     */
    async update(model) {

    }

    /**
     *
     * @param {AbstractModel} model
     * @returns {Promise<AbstractModel>}
     */
    async delete(model) {

    }

    /**
     *
     * @param id
     * @returns {Promise<AbstractModel>}
     */
    async findById(id) {
        if(this._cache.has(id)) {
            return this._cache.get(id);
        }

        let request = this._api.getRequest()
            .setPath(`1.0/${this._type}/show`)
            .setData({id});

        let response = await request.send(),
            model    = await this._dataToModel(response.getData());

        this._cache.set(model.getId(), model, `${this._type}.model`);

        return model;
    }

    /**
     * @api
     * @returns {Promise<[AbstractModel]>}
     */
    async findAll() {
        if(this._cache.has(`${this._type}.collection`)) {
            return this._cache.getByType(`${this._type}.collection`);
        }

        let request  = this._api.getRequest()
                .setPath(`1.0/${this._type}/list`),
            response = await request.send(),
            data     = response.getData(),
            models   = await this._dataToModels(data);

        let collection = this._api.getClass(`collection.${this._type}`, this._api, models);
        this._cache.set(`${this._type}.collection`, true);

        return collection;
    }

    /**
     *
     * @param {Object[]} data
     * @return {Promise<AbstractModel[]>}
     * @private
     */
    async _dataToModels(data) {
        let promises = [],
            models   = [];

        for(let element of data) {
            promises.push(new Promise((resolve) => {
                this._dataToModel(element)
                    .then((model) => {
                        models.push(model);
                        resolve();
                    })
                    .catch((e) => {
                        console.error(e, element);
                    });
            }));
        }

        await Promise.all(promises);

        return models;
    }

    /**
     *
     * @param {Object} data
     * @returns {Promise<AbstractModel>}
     * @private
     */
    async _dataToModel(data) {
        if(data.cseType === 'CSEv1r1') {
            data = await this._api.getCseV1Encryption().decrypt(data, this._type);
        } else if(data.cseType !== 'none') {
            throw this._api.getClass('exception.encryption', data.id, data.cseType);
        }

        let model = this._api.getClass(`model.${this._type}`, data, this._api);
        this._cache.set(model.getId(), model, `${this._type}.model`);

        return model;
    }
}