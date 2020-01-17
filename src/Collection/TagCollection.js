import AbstractCollection from './AbstractCollection';

export default class TagCollection extends AbstractCollection {

    /**
     *
     * @param {Object} data
     * @return {Promise<Tag>}
     * @private
     */
    _makeModelFromData(data) {
        return this._api.getClass('model.tag', data, this._api);
    }
}