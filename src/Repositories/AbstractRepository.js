export default class AbstractRepository {

    /**
     *
     * @param {Api} api
     * @param {String} type
     */
    constructor(api, type) {
        this._api = api;
        /** @type Cache **/
        this._cache = api.getInstance('cache.cache');
        /** @type AbstractConverter **/
        this._converter = api.getInstance(`converter.${type}`);
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
     * @param {AbstractRevisionModel} model
     * @returns {Promise<AbstractRevisionModel>}
     */
    async create(model) {
        if(typeof model.getId() === 'string') {
            // @TODO: Custom error here
            throw new Error('Can not create object with id');
        }

        let data    = await this._converter.toApiObject(model),
            request = this._api.getRequest()
                .setPath(`1.0/${this._type}/create`)
                .setData(data);

        try {
            let response = await request.send();
            model.setId(response.getData().id);
            model.setRevision(response.getData().revision);
            model.setCreated(new Date());
            model.setUpdated(new Date());

            this._cache.set(model.getId(), true);
            this._cache.set(`${model.getId()}.model`, model);
        } catch(e) {
            console.error(e);
            throw e;
        }

        return model;
    }

    /**
     *
     * @param {AbstractRevisionModel} model
     * @returns {Promise<AbstractRevisionModel>}
     */
    async update(model) {
        if(typeof model.getId() !== 'string') {
            // @TODO: Custom error here
            throw new Error('Can not update object without id');
        }

        let data    = this._converter.toApiObject(model),
            request = this._api.getRequest()
                .setPath(`1.0/${this._type}/update`)
                .setData(data);

        try {
            let response = await request.send();
            model.setRevision(response.getData().revision);
            model.setUpdated(new Date());

            this._cache.set(model.getId(), true);
            this._cache.set(`${model.getId()}.model`, model);
        } catch(e) {
            console.error(e);
            throw e;
        }

        return model;
    }

    /**
     *
     * @param {AbstractRevisionModel} model
     * @returns {Promise<AbstractRevisionModel>}
     */
    async delete(model) {
        let request = this._api.getRequest()
            .setPath(`1.0/${this._type}/delete`)
            .setData({id: model.getId(), revision: model.getRevision()});

        try {
            let response = await request.send();
            model.setRevision(response.getData().revision);
            model.setUpdated(new Date());
            this._cache.set(`${model.getId()}.model`, model);

            if(!model.isTrashed()) {
                model.setTrashed(true);
                this._cache.set(model.getId(), true);
            } else {
                this._cache.remove(model.getId());
            }
        } catch(e) {
            console.error(e);
            throw e;
        }

        return model;
    }

    /**
     *
     * @param {AbstractRevisionModel} model
     * @returns {Promise<AbstractRevisionModel>}
     */
    async restore(model) {
        if(!model.getTrashed()) return model;

        let request = this._api.getRequest()
            .setPath(`1.0/${this._type}/restore`)
            .setData({id: model.getId(), revision: model.getRevision()});

        try {
            let response = await request.send();
            model.setRevision(response.getData().revision);
            model.setUpdated(new Date());
            model.setTrashed(false);
            this._cache.set(model.getId(), true);
            this._cache.set(`${model.getId()}.model`, model);
        } catch(e) {
            console.error(e);
            throw e;
        }

        return model;
    }

    /**
     *
     * @param id
     * @returns {Promise<AbstractRevisionModel>}
     */
    async findById(id) {
        if(this._cache.has(id)) {
            return this._cache.get(`${id}.model`);
        }

        let request  = this._api.getRequest()
                .setPath(`1.0/${this._type}/show`)
                .setData({id}),
            response = await request.send();

        return await this._dataToModel(response.getData());
    }

    /**
     * @api
     * @returns {Promise<AbstractRevisionModel[]>}
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

        let collection = this._api.getClass(`collection.${this._type}`, models);
        this._cache.set(`${this._type}.collection`, true);

        return collection;
    }

    /**
     *
     * @param {Object[]} data
     * @return {Promise<AbstractRevisionModel[]>}
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
     * @returns {Promise<AbstractRevisionModel>}
     * @private
     */
    async _dataToModel(data) {
        let model = await this._converter.fromEncryptedData(data);
        this._cache.set(model.getId(), true);
        this._cache.set(`${model.getId()}.model`, model);

        return model;
    }
}