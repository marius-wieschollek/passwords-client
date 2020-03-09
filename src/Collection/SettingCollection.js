import AbstractCollection from './AbstractCollection';

export default class SettingCollection extends AbstractCollection {


    /**
     * @param {(Number|String)} index
     * @return {AbstractModel|string|null}
     * @api
     */
    get(index) {
        if(this._elements.hasOwnProperty(index)) {
            return this._elements[index];
        }

        for(let element of this._elements) {
            if(element.getId() === index || element.getName() === index) return element;
        }

        return null;
    }

    /**
     * @param {(String|AbstractModel)} id
     * @api
     */
    has(id) {
        id = typeof id === 'string' ? id:id.getId();

        for(let element of this._elements) {
            if(element.getId() === id || element.getName() === id) return true;
        }

        return false;
    }

    /**
     * @param {String} id
     * @private
     */
    _removeElement(id) {
        for(let i = 0; i < this._elements.length; i++) {
            if(this._elements[i].getId() === id || this._elements[i].getName() === id) {
                this._elements.splice(i, 1);
                i--;
            }
        }
    }
}