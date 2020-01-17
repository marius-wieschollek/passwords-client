import AbstractCollection from './AbstractCollection';

export default class PasswordCollection extends AbstractCollection {

    /**
     *
     * @param {Object} data
     * @return {Promise<Password>}
     * @private
     */
    _makeModelFromData(data) {
        return this._api.getClass('model.password', data, this._api);
    }
}