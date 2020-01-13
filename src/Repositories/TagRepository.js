import Tag from '../Model/Tag';

export default class TagRepository {

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
     * @return {TagRepository}
     */
    clearCache() {
        this._cache.clear();

        return this;
    }

    /**
     *
     * @param {Tag} tag
     * @returns {Promise<Tag>}
     */
    async create(tag) {
    }

    /**
     *
     * @param {Tag} tag
     * @returns {Promise<Tag>}
     */
    async update(tag) {

    }

    /**
     *
     * @param {Tag} tag
     * @returns {Promise<Tag>}
     */
    async delete(tag) {

    }

    /**
     *
     * @param id
     * @returns {Promise<Tag>}
     */
    async findById(id) {
        if(this._cache.has(id)) {
            return this._cache.get(id);
        }

        let request = this._api.getRequest()
            .setPath('api/1.0/tag/show')
            .setData({id});

        let response = await request.send(),
            tag = await this._dataToModel(response.getData());

        this._cache.set(tag.getId(), tag, 'tag');

        return tag;
    }

    /**
     *
     * @returns {Promise<[Tag]>}
     */
    async findAll() {
        if(this._cache.has('tags.list')) {
            return this._cache.getByType('tag');
        }

        let request = this._api.getRequest()
            .setPath('api/1.0/tag/list');

        let response = await request.send();
        let tags = response.getData();

        let result = [];
        for(let data of tags) {
            try {
                result.push(await this._dataToModel(data));
            } catch(e) {
                console.error(e, data);
            }
        }
        this._cache.set('tags.list', true);

        return result;
    }

    /**
     *
     * @param {Object} data
     * @returns {Promise<Tag>}
     * @private
     */
    async _dataToModel(data) {
        if(data.cseType === 'CSEv1r1') {
            data = await this._api.getCseV1Encryption().decrypt(data, 'tag');
        } else if(data.cseType !== 'none') {
            throw new this._api.getClass('exception.encryption', data.id, data.cseType);
        }

        let tag = this._api.getClass('model.tag', this._api, data);
        this._cache.set(tag.getId(), tag, 'tag');

        return tag
    }
}