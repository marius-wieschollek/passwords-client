import AbstractField from './AbstractField';
import Properties from '../../Configuration/FileField.json';

export default class FileField extends AbstractField {

    /**
     *
     * @param {object} data
     */
    constructor(data) {
        data.type = 'file';
        super(Properties, data);
    }
}