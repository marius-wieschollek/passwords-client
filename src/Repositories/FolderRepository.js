import AbstractRepository from './AbstractRepository';

export default class FolderRepository extends AbstractRepository {

    /**
     * @return {String[]}
     * @constructor
     */
    get AVAILABLE_DETAIL_LEVELS() {
        return ['id', 'model', 'revisions', 'parent', 'passwords', 'folders'];
    }

    /**
     * @returns {String}
     * @constructor
     */
    get TYPE() {
        return 'folder';
    }
}