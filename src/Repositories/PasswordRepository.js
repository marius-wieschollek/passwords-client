import AbstractRepository from './AbstractRepository';

export default class PasswordRepository extends AbstractRepository {

    /**
     *
     * @param {Api} api
     */
    constructor(api) {
        super(api, 'password');
    }
}