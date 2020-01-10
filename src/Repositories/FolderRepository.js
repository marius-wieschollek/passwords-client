import Folder from '../Model/Folder';

export default class FolderRepository {

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
     * @return {FolderRepository}
     */
    clearCache() {
        this._cache.clear();

        return this;
    }

    /**
     *
     * @param {Folder} folder
     * @returns {Promise<Folder>}
     */
    async create(folder) {
    }

    /**
     *
     * @param {Folder} folder
     * @returns {Promise<Folder>}
     */
    async update(folder) {

    }

    /**
     *
     * @param {Folder} folder
     * @returns {Promise<Folder>}
     */
    async delete(folder) {

    }

    /**
     *
     * @param id
     * @returns {Promise<Folder>}
     */
    async findById(id) {
        if(this._cache.has(id)) {
            return this._cache.get(id);
        }

        let request = this._api.getRequest()
            .setPath('api/1.0/folder/show')
            .setData({id});

        let response = await request.send(),
            folder = await this._dataToModel(response.getData());

        this._cache.set(folder.getId(), folder, 'folder');

        return folder;
    }

    /**
     *
     * @returns {Promise<[Folder]>}
     */
    async findAll() {
        if(this._cache.has('folders.list')) {
            return this._cache.getByType('folder');
        }

        let request = this._api.getRequest()
            .setPath('api/1.0/folder/list');

        let response = await request.send();
        let folders = response.getData();

        let result = [];
        for(let data of folders) {
            result.push(await this._dataToModel(data));
        }
        this._cache.set('folders.list', true);

        return result;
    }

    /**
     *
     * @param {Object} data
     * @returns {Promise<Folder>}
     * @private
     */
    async _dataToModel(data) {
        if(data.cseType === 'CSEv1r1') {
            data = await this._api.getCseV1Encryption().decrypt(data, 'folder');
        }

        let folder = this._api.getClass('model.folder', this._api, data);
        this._cache.set(folder.getId(), folder, 'folder');

        return folder
    }
}