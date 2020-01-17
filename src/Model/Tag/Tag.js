import AbstractModel from '../AbstractModel';
import Properties from '../../Configuration/Tag';

export default class Tag extends AbstractModel {

    /**
     *
     * @param {Object} [data={}]
     */
    constructor(data = {}) {
        super(Properties, data);
    }

    /**
     * @return {String}
     */
    getId() {
        return this.getProperty('id');
    }

    /**
     * @param {String} value
     *
     * @return {Tag}
     */
    setId(value) {
        return this.setProperty('id', value);
    }

    /**
     * @return {String}
     */
    getLabel() {
        return this.getProperty('label');
    }

    /**
     * @param {String} value
     *
     * @return {Tag}
     */
    setLabel(value) {
        return this.setProperty('label', value);
    }

    /**
     * @return {String}
     */
    getColor() {
        return this.getProperty('color');
    }

    /**
     * @param {String} value
     *
     * @return {Tag}
     */
    setColor(value) {
        return this.setProperty('color', value);
    }
}