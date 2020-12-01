export default class ModelService {

    /**
     *
     * @param {BaseClassLoader} cl
     */
    constructor(cl) {
        this._cl = cl;
        this._cache = /** @type {Cache} **/ cl.getInstance('cache.cache');
    }

    hasModel(type, id) {
        return this._cache.has(`${type}.${id}`);
    }

    getModel(type, id) {
        if(this.hasModel(type, id)) {
            return this._cache.get(`${type}.${id}`);
        }
        return null;
    }

    addModel(type, model) {
        this._cache.set(`${type}.${model.getId()}`, model);
        // @TODO update related models
    }

    /**
     *
     * @param type
     * @param data
     * @param detailLevel
     * @returns {Promise<AbstractRevisionModel|Tag>|Promise<AbstractRevisionModel|Password>|Folder}
     */
    makeFromApiData(type, data, detailLevel = []) {
        if(type === 'password') return this.makePasswordFromApiData(data, detailLevel)
        if(type === 'folder') return this.makeFolderFromApiData(data, detailLevel)
        if(type === 'tag') return this.makeTagFromApiData(data, detailLevel)
    }

    async makePasswordCollectionFromApiData(data, detailLevel = []) {
        let passwords = [];
        for(let passwordData of data) {
            passwords.push(await this.makePasswordFromApiData(passwordData, detailLevel));
        }

        return this._cl.getClass('collection.password', passwords);
    }

    async makePasswordFromApiData(data, detailLevel = []) {
        let converter = /** @type {PasswordConverter} **/ this._cl.getInstance('converter.password'),
            newModel  = await converter.fromEncryptedData(data);
        newModel.setDetailLevel(detailLevel);

        let revisionCacheKey = `password.${newModel.getId()}.${newModel.getRevision()}`;
        if(!this._cache.has(revisionCacheKey)) {
            let revisionModel = converter.fromModel(newModel);
            this._cache.set(revisionCacheKey, revisionModel);
        }
        if(detailLevel.indexOf('folder') !== -1) {
            newModel.setParent(await this.makeFolderFromApiData(data.folder, 'model'));
        }
        await this._makeCollectionFromData(newModel, 'password', 'tag', detailLevel, data);
        await this._makeCollectionFromData(newModel, 'password', 'revision', detailLevel, data);

        let cacheKey = `password.${newModel.getId()}`;
        if(!this._cache.has(cacheKey)) {
            this._cache.set(cacheKey, newModel);
            return newModel;
        } else {
            return this._mergePasswordModel(this._cache.get(cacheKey), newModel);
        }
    }

    async makeFolderCollectionFromApiData(data, detailLevel = []) {
        let folders = [];
        for(let folderData of data) {
            folders.push(await this.makeFolderFromApiData(folderData, detailLevel));
        }

        return this._cl.getClass('collection.folder', folders);
    }

    /**
     *
     * @param data
     * @param detailLevel
     * @return {Folder}
     */
    async makeFolderFromApiData(data, detailLevel = []) {
        let converter = /** @type {FolderConverter} **/ this._cl.getInstance('converter.folder'),
            newModel  = await converter.fromEncryptedData(data);
        newModel.setDetailLevel(detailLevel);

        let revisionCacheKey = `folder.${newModel.getId()}.${newModel.getRevision()}`;
        if(!this._cache.has(revisionCacheKey)) {
            let revisionModel = converter.fromModel(newModel);
            this._cache.set(revisionCacheKey, revisionModel);
        }
        await this._makeCollectionFromData(newModel, 'folder', 'revision', detailLevel, data);
        await this._makeCollectionFromData(newModel, 'folder', 'folder', detailLevel, data);
        await this._makeCollectionFromData(newModel, 'folder', 'password', detailLevel, data);

        if(detailLevel.indexOf('parent') !== -1) {
            newModel.setParent(await this.makeFolderFromApiData(data.parent, 'model'));
        }

        let cacheKey = `folder.${newModel.getId()}`;
        if(!this._cache.has(cacheKey)) {
            this._cache.set(cacheKey, newModel);
            return newModel;
        } else {
            return this._mergeFolderModel(this._cache.get(cacheKey), newModel);
        }
    }

    async makeTagCollectionFromApiData(data, detailLevel = []) {
        let tags = [];
        for(let tagData of data) {
            tags.push(await this.makeTagFromApiData(tagData, detailLevel));
        }

        return this._cl.getClass('collection.tag', tags);
    }

    async makeTagFromApiData(data, detailLevel = []) {
        let converter = /** @type {TagConverter} **/ this._cl.getInstance('converter.tag'),
            newModel  = await converter.fromEncryptedData(data);
        newModel.setDetailLevel(detailLevel);

        let revisionCacheKey = `tag.${newModel.getId()}.${newModel.getRevision()}`;
        if(!this._cache.has(revisionCacheKey)) {
            let revisionModel = converter.fromModel(newModel);
            this._cache.set(revisionCacheKey, revisionModel);
        }
        await this._makeCollectionFromData(newModel, 'tag', 'password', detailLevel, data);
        await this._makeCollectionFromData(newModel, 'tag', 'revision', detailLevel, data);

        let cacheKey = `tag.${newModel.getId()}`;
        if(!this._cache.has(cacheKey)) {
            this._cache.set(cacheKey, newModel);
            return newModel;
        } else {
            return this._mergeTagModel(this._cache.get(cacheKey), newModel);
        }
    }

    async _makeCollectionFromData(model, baseType, type, detailLevel, data) {
        let property = `${type}s`;
        if(detailLevel.indexOf(property) !== -1) {
            if(!data.hasOwnProperty(property)) {
                // @TODO data missing = potential bug?
            }
            let method = type === 'revision' ?
                         `_make${baseType[0].toUpperCase()}${baseType.substr(1)}Revision`:
                         `make${type[0].toUpperCase()}${type.substr(1)}FromApiData`,
                models = [];
            for(let modelData of data[property]) {
                models.push(await this[method](modelData, 'model'));
            }

            let cacheKey = `${baseType}.${model.getId()}.${property}`;
            if(this._cache.has(cacheKey)) {
                let collection = /** @type {AbstractCollection} **/ this._cache.has(cacheKey);
                collection.replaceAll(models);
                model.setProperty(property, collection);
            } else {
                let collection = this._cl.getClass(type === 'revision' ? `collection.${baseType}`:`collection.${type}`, models);
                this._cache.set(cacheKey, collection);
                model.setProperty(property, collection);
            }
        }
    }

    /**
     *
     * @param {Password} model
     * @param {Password}  newModel
     * @returns {Password}
     * @private
     */
    _mergePasswordModel(model, newModel) {
        if(newModel.getProperty('revisions') !== undefined) {
            model.setProperty('revisions', newModel.getProperty('revisions'));
        }
        if(newModel.getProperty('tags') !== undefined) {
            model.setProperty('tags', newModel.getProperty('tags'));
        }
        if(newModel.getProperty('folder') !== undefined) {
            model.setProperty('folder', newModel.getProperty('folder'));
        }
        this._mergeModelDetailLevel(model, newModel.getDetailLevel());

        return newModel;
    }

    /**
     *
     * @param {Folder} model
     * @param {Folder}  newModel
     * @returns {Folder}
     * @private
     */
    _mergeFolderModel(model, newModel) {
        if(newModel.getProperty('revisions') !== undefined) {
            model.setProperty('revisions', newModel.getProperty('revisions'));
        }
        if(newModel.getProperty('passwords') !== undefined) {
            model.setProperty('passwords', newModel.getProperty('passwords'));
        }
        if(newModel.getProperty('folders') !== undefined) {
            model.setProperty('folders', newModel.getProperty('folders'));
        }
        if(newModel.getProperty('parent') !== undefined) {
            model.setProperty('parent', newModel.getProperty('parent'));
        }
        this._mergeModelDetailLevel(model, newModel.getDetailLevel());

        return newModel;
    }

    /**
     *
     * @param {Tag} model
     * @param {Tag}  newModel
     * @returns {Tag}
     * @private
     */
    _mergeTagModel(model, newModel) {
        if(newModel.getProperty('revisions') !== undefined) {
            model.setProperty('revisions', newModel.getProperty('revisions'));
        }
        if(newModel.getProperty('passwords') !== undefined) {
            model.setProperty('passwords', newModel.getProperty('passwords'));
        }
        this._mergeModelDetailLevel(model, newModel.getDetailLevel());

        return newModel;
    }

    /**
     * @param {AbstractRevisionModel} model
     * @param {String[]} detailLevel
     * @private
     */
    _mergeModelDetailLevel(model, detailLevel = []) {
        let modelDetailLevel = model.getDetailLevel();
        for(let level of detailLevel) {
            if(modelDetailLevel.indexOf(level) === -1) {
                modelDetailLevel.push(level);
            }
        }
        model.setDetailLevel(modelDetailLevel);
    }
}