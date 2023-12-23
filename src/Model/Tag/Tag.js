import Properties from '../../Configuration/Tag';
import AbstractRevisionModel from '../AbstractRevisionModel';

export default class Tag extends AbstractRevisionModel {

    get MODEL_TYPE() {return 'tag';}

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