import AbstractRepository from './AbstractRepository';

export default class FolderRepository extends AbstractRepository {

    /**
     *
     * @param {Api} api
     */
    constructor(api) {
        super(api, 'folder');
    }
}