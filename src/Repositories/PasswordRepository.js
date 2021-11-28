import AbstractRepository from './AbstractRepository';

export default class PasswordRepository extends AbstractRepository {

    /**
     * @return {String[]}
     * @constructor
     */
    get AVAILABLE_DETAIL_LEVELS() {
        return ['id', 'model', 'revisions', 'folder', 'tags'];
    }

    /**
     * @returns {String}
     * @constructor
     */
    get TYPE() {
        return 'password';
    }
}