import Cache from '../Cache/Cache';
import PasswordRepository from '../Repositories/PasswordRepository';
import SessionAuthorization from '../Authorization/SessionAuthorization';
import CSEv1Encryption from '../Encryption/CSEv1Encryption';
import NoEncryption from '../Encryption/NoEncryption';
import FolderRepository from '../Repositories/FolderRepository';
import TagRepository from '../Repositories/TagRepository';
import ApiRequest from '../Network/ApiRequest';
import Password from '../Model/Password/Password';
import Folder from '../Model/Folder/Folder';
import Server from '../Model/Server/Server';
import Tag from '../Model/Tag/Tag';
import Session from '../Model/Session/Session';
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
import PasswordCollection from '../Collection/PasswordCollection';
import FolderCollection from '../Collection/FolderCollection';
import TagCollection from '../Collection/TagCollection';
import PasswordConverter from '../Converter/PasswordConverter';
import FolderConverter from '../Converter/FolderConverter';
import TagConverter from '../Converter/TagConverter';
import DataField from '../Model/CustomField/DataField';
import EmailField from '../Model/CustomField/EmailField';
import FileField from '../Model/CustomField/FileField';
import SecretField from '../Model/CustomField/SecretField';
import TextField from '../Model/CustomField/TextField';
import UrlField from '../Model/CustomField/UrlField';
import CustomFieldCollection from '../Collection/CustomFieldCollection';
import CustomFieldConverter from '../Converter/CustomFieldConverter';
import Setting from '../Model/Setting/Setting';
import SettingRepository from '../Repositories/SettingRepository';
import SettingConverter from '../Converter/SettingConverter';
import SettingCollection from '../Collection/SettingCollection';

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
        this._setConfig(config);

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
     * @param config
     * @private
     */
    _setConfig(config) {
        if(!config.hasOwnProperty('userAgent')) {
            config.userAgent = null;
        }

        if(config.hasOwnProperty('defaultEncryption') && ['auto', 'none', 'csev1'].indexOf(config.defaultEncryption) === -1) {
            throw new ConfigurationError('Invalid default encryption');
        } else {
            config.defaultEncryption = 'auto';
        }

        this._config = config;
    }

    /**
     *
     * @param {String} event
     * @param {Function} listener
     */
    on(event, listener) {
        this._events.on(event, listener);
    }

    /**
     *
     * @param {String} event
     * @param {Function} listener
     */
    once(event, listener) {
        this._events.once(event, listener);
    }

    /**
     *
     * @param {String} event
     * @param {Function} listener
     */
    off(event, listener) {
        this._events.off(event, listener);
    }

    /**
     *
     * @param {String} event
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
     * @return {ApiRequest}
     */
    getRequest() {
        /** @type {ApiRequest} **/
        let request = this.getClass('network.request', this, this._server.getApiUrl(), this.getSession());
        if(this._config.userAgent !== null) {
            request.setUserAgent(this._config.userAgent);
        }

        return request;
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
        return this.getInstance('authorization.session');
    }

    /**
     *
     * @returns {PasswordRepository}
     */
    getPasswordRepository() {
        return this.getInstance('repository.password');
    }

    /**
     *
     * @returns {FolderRepository}
     */
    getFolderRepository() {
        return this.getInstance('repository.folder');
    }

    /**
     *
     * @returns {TagRepository}
     */
    getTagRepository() {
        return this.getInstance('repository.tag');
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
     * @returns {CSEv1Encryption}
     */
    getDefaultEncryption() {
        let mode = 'auto';
        if(this._config.hasOwnProperty('defaultEncryption')) {
            mode = this._config.defaultEncryption;
        }

        if(mode === 'none') {
            return this.getInstance('encryption.none');
        }
        if(mode === 'csev1') {
            return this.getInstance('encryption.csev1');
        }

        let csev1 = this.getInstance('encryption.csev1');
        if(csev1.enabled()) return csev1;

        return this.getInstance('encryption.none');
    }

    /**
     *
     * @param {String} name
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
     * @param {String} name
     * @param {*} properties
     * @return {Object}
     */
    getClass(name, ...properties) {
        let path = name.split('.');

        if(!this._classes.hasOwnProperty(path[0]) || !this._classes[path[0]].hasOwnProperty(path[1])) {
            throw new Error(`The class ${name} does not exist`);
        }

        let creator = this._classes[path[0]][path[1]];
        if(creator instanceof Function) {
            if(!creator.prototype || creator.hasOwnProperty('arguments') && creator.hasOwnProperty('caller')) {
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
                password: () => { return new PasswordRepository(this); },
                folder  : () => { return new FolderRepository(this); },
                tag     : () => { return new TagRepository(this); },
                setting : () => { return new SettingRepository(this); }
            },
            collection   : {
                password: (...e) => { return new PasswordCollection(this.getInstance('converter.password'), ...e); },
                folder  : (...e) => { return new FolderCollection(this.getInstance('converter.folder'), ...e); },
                field   : (...e) => { return new CustomFieldCollection(this.getInstance('converter.field'), ...e); },
                tag     : (...e) => { return new TagCollection(this.getInstance('converter.tag'), ...e); },
                setting : (...e) => { return new SettingCollection(this.getInstance('converter.setting'), ...e); }
            },
            converter    : {
                password: () => { return new PasswordConverter(this); },
                folder  : () => { return new FolderConverter(this); },
                field   : () => { return new CustomFieldConverter(this); },
                tag     : () => { return new TagConverter(this); },
                setting : () => { return new SettingConverter(this); }
            },
            model        : {
                password   : Password,
                folder     : Folder,
                tag        : Tag,
                server     : Server,
                session    : Session,
                dataField  : DataField,
                emailField : EmailField,
                fileField  : FileField,
                secretField: SecretField,
                textField  : TextField,
                urlField   : UrlField,
                setting    : Setting
            },
            network      : {
                request : ApiRequest,
                response: ApiResponse
            },
            authorization: {
                session: () => { return new SessionAuthorization(this); }
            },
            challenge    : {
                pwdv1: PWDv1Challenge
            },
            token        : {
                user   : UserToken,
                request: RequestToken
            },
            encryption   : {
                none : NoEncryption,
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