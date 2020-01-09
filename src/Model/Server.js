import ConfigruationError from '../Exception/ConfigruationError';
import Properties from '../Configuration/Server';
import ApiRequest from '../Api/ApiRequest';
import AbstractModel from './AbstractModel';
import Cache from '../Cache/Cache';
import PasswordRepository from '../Repositories/PasswordRepository';
import Session from './Session';
import SessionAuthorisation from '../Authorisation/SessionAuthorisation';
import CSEv1Encryption from '../Encryption/CSEv1Encryption';
import FolderRepository from '../Repositories/FolderRepository';
import TagRepository from '../Repositories/TagRepository';

export default class Server extends AbstractModel {

    constructor(data = {}, properties = null) {
        if(data.hasOwnProperty('defaultEncryption') && ['auto', 'none', 'CSEv1r1'].indexOf(data.defaultEncryption) === -1) {
            throw new ConfigruationError('Invalid default encryption');
        }

        if(!data.hasOwnProperty('baseUrl') || data.baseUrl.substr(0, 5) !== 'https') {
            throw new ConfigruationError('Base URL missing or invalid');
        }

        if(properties !== null) Object.assign(Properties, properties);

        super(Properties, data);

        this._session = new Session()
            .setUser(this.getUser())
            .setToken(this.getToken());
        this._tagRepository = null;
        this._folderRepository = null;
        this._passwordRepository = null;
        this._sessionAuthorisation = null;
        this._classes = [];
    }

    getBaseUrl() {
        return this._getProperty('baseUrl');
    }

    setBaseUrl(value) {
        return this._setProperty('baseUrl', value);
    }

    getUser() {
        return this._getProperty('user');
    }

    setUser(value) {
        let result = this._setProperty('user', value);
        this._session.setUser(this.getUser());
        return result;
    }

    getToken() {
        return this._getProperty('token');
    }

    setToken(value) {
        let result = this._setProperty('token', value);
        this._session.setToken(this.getToken());
        return result;
    }

    getApiUrl() {
        return `${this.getBaseUrl()}index.php/apps/passwords/`;
    }

    /**
     *
     * @returns {ApiRequest}
     */
    createRequest() {
        return new ApiRequest()
            .setUrl(this.getApiUrl())
            .setSession(this._session);
    }

    /**
     *
     * @returns {SessionAuthorisation}
     */
    getSessionAuthorisation() {
        if(this._sessionAuthorisation === null) {
            this._sessionAuthorisation = new SessionAuthorisation(this);
        }

        return this._sessionAuthorisation;
    }

    /**
     *
     * @returns {PasswordRepository}
     */
    getPasswordRepository() {
        if(this._passwordRepository === null) {
            this._passwordRepository = new PasswordRepository(this, new Cache());
        }

        return this._passwordRepository;
    }

    /**
     *
     * @returns {FolderRepository}
     */
    getFolderRepository() {
        if(this._folderRepository === null) {
            this._folderRepository = new FolderRepository(this, new Cache());
        }

        return this._folderRepository;
    }

    /**
     *
     * @returns {TagRepository}
     */
    getTagRepository() {
        if(this._tagRepository === null) {
            this._tagRepository = new TagRepository(this, new Cache());
        }

        return this._tagRepository;
    }

    /**
     *
     * @returns {CSEv1Encryption}
     */
    getCseV1Encryption() {
        if(!this._classes.hasOwnProperty('CSEv1Encryption')) {
            this._classes['CSEv1Encryption'] = new CSEv1Encryption();
        }

        return this._classes['CSEv1Encryption'];
    }
}