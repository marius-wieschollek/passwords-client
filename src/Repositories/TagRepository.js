import AbstractRepository from './AbstractRepository';

export default class TagRepository extends AbstractRepository {

    /**
     *
     * @param {Api} api
     */
    constructor(api) {
        super(api, 'tag');
    }
}