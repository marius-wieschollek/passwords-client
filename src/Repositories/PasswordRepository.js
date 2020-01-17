import AbstractRepository from './AbstractRepository';

export default class PasswordRepository extends AbstractRepository {

    /**
     *
     * @param {Api} api
     * @param {Cache} cache
     */
    constructor(api, cache) {
        super(api, cache, 'password');
    }
}