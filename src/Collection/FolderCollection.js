import AbstractCollection from './AbstractCollection';

export default class FolderCollection extends AbstractCollection {

    /**
     *
     * @param {Object} data
     * @return {Promise<Folder>}
     * @private
     */
    _makeModelFromData(data) {
        return this._api.getClass('model.folder', data, this._api);
    }
}