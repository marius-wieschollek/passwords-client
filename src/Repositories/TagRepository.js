import AbstractRepository from './AbstractRepository';

export default class TagRepository extends AbstractRepository {

    /**
     * @return {String[]}
     * @constructor
     */
    get AVAILABLE_DETAIL_LEVELS() {
        return ['id', 'model', 'revisions', 'passwords'];
    }

    /**
     * @returns {String}
     * @constructor
     */
    get TYPE() {
        return 'tag';
    }
}