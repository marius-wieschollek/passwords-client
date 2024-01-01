import AbstractField from './AbstractField';
import Properties from '../../Configuration/DataField.json';

export default class DataField extends AbstractField {

    /**
     *
     * @param {object} data
     */
    constructor(data) {
        data.type = 'data';
        super(Properties, data);
    }
}