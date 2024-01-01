import AbstractField from './AbstractField';
import Properties from '../../Configuration/TextField.json';

export default class TextField extends AbstractField {

    /**
     *
     * @param {object} data
     */
    constructor(data) {
        data.type = 'text';
        super(Properties, data);
    }
}