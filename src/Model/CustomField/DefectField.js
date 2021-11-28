import AbstractField from './AbstractField';
import Properties from '../../Configuration/TextField.json';

export default class DefectField extends AbstractField {

    /**
     *
     * @param {object} data
     */
    constructor(data) {
        data.type = 'defect';
        super(Properties, data);
    }
}