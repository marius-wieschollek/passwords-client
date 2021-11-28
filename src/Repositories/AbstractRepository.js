export default class AbstractRepository {

    /**
     * @return {String[]}
     * @constructor
     */
    get AVAILABLE_DETAIL_LEVELS() {
        return ['id', 'model'];
    }

    /**
     * @return {String[]}
     * @constructor
     */
    get DEFAULT_DETAIL_LEVEL() {
        return ['model'];
    }

    get TYPE() {
        return 'abstract';
    }

    /**
     *
     * @param {BasicPasswordsClient} api
     */
    constructor(api) {
        this._api = api;
        /** @type {ModelService} **/
        this._modelService = api.getInstance('service.model');
        /** @type {AbstractConverter} **/
        this._converter = api.getInstance(`converter.${this.TYPE}`);
    }

    /**
     *
     * @deprecated
     * @return {AbstractRepository}
     */
    clearCache() {
        console.trace('AbstractRepository.clearCache() is deprecated');

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
                          .setPath(`1.0/${this.TYPE}/create`)
                          .setData(data);

        try {
            let response = await request.send();
            model.setId(response.getData().id);
            model.setRevision(response.getData().revision);
            model.setCreated(new Date());
            model.setUpdated(new Date());
            this._modelService.addModel(this.TYPE, model);
            await this.findById(model.getId());
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

        let data    = await this._converter.toApiObject(model),
            request = this._api.getRequest()
                          .setMethod('PATCH')
                          .setPath(`1.0/${this.TYPE}/update`)
                          .setData(data);

        try {
            let response = await request.send();
            model.setRevision(response.getData().revision);
            model.setUpdated(new Date());
            this.findById(model.getId());
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
                          .setMethod('DELETE')
                          .setPath(`1.0/${this.TYPE}/delete`)
                          .setData({id: model.getId(), revision: model.getRevision()});

        try {
            let response = await request.send();
            model.setRevision(response.getData().revision);
            model.setUpdated(new Date());

            if(!model.isTrashed()) {
                model.setTrashed(true);
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
                          .setMethod('PATCH')
                          .setPath(`1.0/${this.TYPE}/restore`)
                          .setData({id: model.getId(), revision: model.getRevision()});

        try {
            let response = await request.send();
            model.setRevision(response.getData().revision);
            model.setUpdated(new Date());
            model.setTrashed(false);
        } catch(e) {
            console.error(e);
            throw e;
        }

        return model;
    }

    /**
     *
     * @param {String} id
     * @param {(String|String[]|null)} detailLevel
     * @returns {Promise<AbstractRevisionModel>}
     */
    async findById(id, detailLevel = null) {
        detailLevel = this._getDetailLevel(detailLevel);

        let details  = detailLevel.join('+'),
            request  = this._api.getRequest()
                           .setPath(`1.0/${this.TYPE}/show`)
                           .setData({id, details}),
            response = await request.send();

        return await this._dataToModel(response.getData(), detailLevel);
    }

    /**
     * @api
     * @param {(String|String[]|null)} detailLevel
     * @returns {Promise<AbstractRevisionModel[]>}
     */
    async findAll(detailLevel = null) {
        detailLevel = this._getDetailLevel(detailLevel);
        let details  = detailLevel.join('+'),
            request  = this._api.getRequest()
                           .setData({details})
                           .setPath(`1.0/${this.TYPE}/list`),
            response = await request.send(),
            data     = response.getData(),
            models   = await this._dataToModels(data, detailLevel);

        return this._api.getClass(`collection.${this.TYPE}`, models);
    }

    /**
     *
     * @param {Object[]} data
     * @param {(String[])} detailLevel
     * @return {Promise<AbstractRevisionModel[]>}
     * @private
     */
    _dataToModels(data, detailLevel) {
        return new Promise(async (resolve, reject) => {
            let promises = [],
                models   = [];

            for(let element of data) {
                promises.push(
                    new Promise(
                        (resolve) => {
                            this._dataToModel(element, detailLevel)
                                .then((model) => {
                                    models.push(model);
                                    resolve();
                                })
                                .catch(reject);
                        }
                    )
                );
            }

            await Promise.all(promises);

            resolve(models);
        });
    }

    /**
     *
     * @param {Object} data
     * @param {String[]} detailLevel
     * @returns {Promise<AbstractRevisionModel>}
     * @private
     */
    async _dataToModel(data, detailLevel) {
        return await this._modelService.makeFromApiData(this.TYPE, data, detailLevel);
    }

    /**
     * @param {(String[]|String|null)} detailLevel
     * @return {String[]}
     * @private
     */
    _getDetailLevel(detailLevel) {
        if(typeof detailLevel === 'string') {
            detailLevel = detailLevel.trim().split('+');
        }
        if(detailLevel === null || detailLevel.length === 0) return this.DEFAULT_DETAIL_LEVEL;

        for(let level of detailLevel) {
            if(this.AVAILABLE_DETAIL_LEVELS.indexOf(level) === -1) {
                // @TODO custom error
                throw new Error('Unknown detail level ' + level);
            }
        }

        return detailLevel;
    }
}