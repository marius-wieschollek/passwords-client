import AbstractRepository from './AbstractRepository';

export default class FolderRepository extends AbstractRepository {

    /**
     *
     * @param {Api} api
     * @param {Cache} cache
     */
    constructor(api, cache) {
        super(api, cache, 'folder');
    }
}