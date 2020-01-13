import Cache from '../Cache/Cache';
import PasswordRepository from '../Repositories/PasswordRepository';
import SessionAuthorization from '../Authorization/SessionAuthorization';
import CSEv1Encryption from '../Encryption/CSEv1Encryption';
import FolderRepository from '../Repositories/FolderRepository';
import TagRepository from '../Repositories/TagRepository';
import ApiRequest from '../Network/ApiRequest';
import Password from '../Model/Password';
import Folder from '../Model/Folder';
import Server from '../Model/Server';
import Tag from '../Model/Tag';
import Session from '../Model/Session';
import ApiResponse from '../Network/ApiResponse';
import ExportV1Encryption from '../Encryption/ExportV1Encryption';
import CSEv1Keychain from '../Encryption/Keychain/CSEv1Keychain';
import PWDv1Challenge from '../Authorization/Challenge/PWDv1Challenge';
import BooleanState from '../State/BooleanState';
import ConfigurationError from '../Exception/ConfigruationError';
import ResponseContentTypeError from '../Exception/ResponseContentTypeError';
import ResponseDecodingError from '../Exception/ResponseDecodingError';
import UnknownPropertyError from '../Exception/UnknownPropertyError';
import ObjectMerger from '../Utility/ObjectMerger';
import BadRequestError from '../Exception/Http/BadRequestError';
import UnauthorizedError from '../Exception/Http/UnauthorizedError';
import ForbiddenError from '../Exception/Http/ForbiddenError';
import NotFoundError from '../Exception/Http/NotFoundError';
import TooManyRequestsError from '../Exception/Http/TooManyRequestsError';
import MethodNotAllowedError from '../Exception/Http/MethodNotAllowedError';
import InternalServerError from '../Exception/Http/InternalServerError';
import BadGatewayError from '../Exception/Http/BadGatewayError';
import ServiceUnavailableError from '../Exception/Http/ServiceUnavailableError';
import GatewayTimeoutError from '../Exception/Http/GatewayTimeoutError';
import NetworkError from '../Exception/NetworkError';
import HttpError from '../Exception/Http/HttpError';
import EventEmitter from 'eventemitter3';
import UserToken from '../Authorization/Token/UserToken';
import RequestToken from '../Authorization/Token/RequestToken';
import TokenTypeNotSupported from '../Exception/TokenTypeNotSupported';
import EncryptionTypeNotSupported from '../Exception/EncryptionTypeNotSupported';

export default class Api {

    /**
     *
     * @param {Server} server
     * @param {Object} [config={}]
     * @param {Object} [classes={}]
     */
    constructor(server, config = {}, classes = {}) {
        this._classes = ObjectMerger.merge(this._getDefaultClasses(), classes);
        this._instances = {};

        if(config.hasOwnProperty('defaultEncryption') && ['auto', 'none', 'CSEv1r1'].indexOf(config.defaultEncryption) === -1) {
            throw new ConfigurationError('Invalid default encryption');
        }

        this._config = config;

        if(!(server instanceof this._classes.model.server)) {
            server = this.getInstance('model.server', server);
        } else {
            this._instances.model = {server};
        }

        this._server = server;
        this._session = this.getInstance('model.session', server.getUser(), server.getToken());
        this._events = this.getInstance('event.event');
    }

    /**
     *
     * @param {string} event
     * @param {Function} listener
     */
    on(event, listener) {
        this._events.on(event, listener);
    }

    /**
     *
     * @param {string} event
     * @param {Function} listener
     */
    once(event, listener) {
        this._events.once(event, listener);
    }

    /**
     *
     * @param {string} event
     * @param {Function} listener
     */
    off(event, listener) {
        this._events.off(event, listener);
    }

    /**
     *
     * @param {string} event
     * @param {Object} data
     */
    emit(event, data) {
        this._events.emit(event, data);
    }

    /**
     *
     * @return {Server}
     */
    getServer() {
        return this._server;
    }

    /**
     *
     * @returns {ApiRequest}
     */
    getRequest() {
        return this.getClass('network.request', this, this._server.getApiUrl(), this.getSession());
    }

    /**
     * @returns {Session}
     */
    getSession() {
        return this._session
            .setUser(this._server.getUser())
            .setToken(this._server.getToken());
    }


    /**
     *
     * @returns {SessionAuthorization}
     * @deprecated
     */
    getSessionAuthorisation() {
        return this.getSessionAuthorization();
    }


    /**
     *
     * @returns {SessionAuthorization}
     */
    getSessionAuthorization() {
        return this.getInstance('authorization.session', this);
    }

    /**
     *
     * @returns {PasswordRepository}
     */
    getPasswordRepository() {
        let cache = this.getInstance('cache.cache');
        return this.getInstance('repository.password', this, cache);
    }

    /**
     *
     * @returns {FolderRepository}
     */
    getFolderRepository() {
        let cache = this.getInstance('cache.cache');
        return this.getInstance('repository.folder', this, cache);
    }

    /**
     *
     * @returns {TagRepository}
     */
    getTagRepository() {
        let cache = this.getInstance('cache.cache');
        return this.getInstance('repository.tag', this, cache);
    }

    /**
     *
     * @returns {CSEv1Encryption}
     */
    getCseV1Encryption() {
        return this.getInstance('encryption.csev1');
    }

    /**
     *
     * @param {string} name
     * @param {*} properties
     * @return {Object}
     */
    getInstance(name, ...properties) {
        let path = name.split('.');

        if(this._instances.hasOwnProperty(path[0]) && this._instances[path[0]].hasOwnProperty(path[1])) {
            return this._instances[path[0]][path[1]];
        }

        if(!this._instances.hasOwnProperty(path[0])) {
            this._instances[path[0]] = {};
        }

        let instance = this.getClass(name, ...properties);
        this._instances[path[0]][path[1]] = instance;

        return instance;
    }

    /**
     *
     * @param {string} name
     * @param {*} properties
     * @return {Object}
     */
    getClass(name, ...properties) {
        let path    = name.split('.'),
            creator = this._classes[path[0]][path[1]];

        if(creator.hasOwnProperty('name') && creator.name === creator.prototype.constructor.name) {
            if(creator.hasOwnProperty('arguments') && creator.hasOwnProperty('caller')) {
                return creator(...properties);
            }

            return new creator(...properties);
        } else {
            return creator;
        }
    }

    /**
     *
     * @return {Object}
     * @private
     */
    _getDefaultClasses() {
        return {
            repository   : {
                password: PasswordRepository,
                folder  : FolderRepository,
                tag     : TagRepository
            },
            model        : {
                password: Password,
                folder  : Folder,
                tag     : Tag,
                server  : Server,
                session : Session
            },
            network      : {
                request : ApiRequest,
                response: ApiResponse
            },
            authorization: {
                session: SessionAuthorization
            },
            challenge    : {
                pwdv1: PWDv1Challenge
            },
            token        : {
                user   : UserToken,
                request: RequestToken
            },
            encryption   : {
                csev1: CSEv1Encryption,
                expv1: ExportV1Encryption
            },
            keychain     : {
                csev1: CSEv1Keychain
            },
            cache        : {
                cache: Cache
            },
            state        : {
                boolean: BooleanState
            },
            event        : {
                event: EventEmitter
            },
            exception    : {
                configuration: ConfigurationError,
                contenttype  : ResponseContentTypeError,
                decoding     : ResponseDecodingError,
                property     : UnknownPropertyError,
                challenge    : TokenTypeNotSupported,
                token        : TokenTypeNotSupported,
                encryption   : EncryptionTypeNotSupported,
                network      : NetworkError,
                http         : HttpError,
                400          : BadRequestError,
                401          : UnauthorizedError,
                403          : ForbiddenError,
                404          : NotFoundError,
                405          : MethodNotAllowedError,
                429          : TooManyRequestsError,
                500          : InternalServerError,
                502          : BadGatewayError,
                503          : ServiceUnavailableError,
                504          : GatewayTimeoutError
            }
        };
    }
}