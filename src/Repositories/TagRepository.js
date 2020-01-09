import Tag from '../Model/Tag';

export default class TagRepository {

    /**
     *
     * @param {Server} server
     * @param {Cache} cache
     */
    constructor(server, cache) {
        this._server = server;
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

        let request = this._server.createRequest()
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

        let request = this._server.createRequest()
            .setPath('api/1.0/tag/list');

        let response = await request.send();
        let tags = response.getData();

        let result = [];
        for(let data of tags) {
            result.push(await this._dataToModel(data));
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
            data = await this._server.getCseV1Encryption().decrypt(data, 'tag');
        }

        let tag = new Tag(this._server, data);
        this._cache.set(tag.getId(), tag, 'tag');

        return tag
    }
}