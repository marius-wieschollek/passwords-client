import AbstractConverter from './AbstractConverter';

export default class TagConverter extends AbstractConverter {

    /**
     * @param {Api} api
     */
    constructor(api) {
        super(api, 'tag');
    }
}