import PasswordRepository from "../Repositories/PasswordRepository";
import FolderRepository from "../Repositories/FolderRepository";
import TagRepository from "../Repositories/TagRepository";
import SettingRepository from "../Repositories/SettingRepository";
import PasswordCollection from "../Collection/PasswordCollection";
import FolderCollection from "../Collection/FolderCollection";
import CustomFieldCollection from "../Collection/CustomFieldCollection";
import TagCollection from "../Collection/TagCollection";
import SettingCollection from "../Collection/SettingCollection";
import PasswordConverter from "../Converter/PasswordConverter";
import FolderConverter from "../Converter/FolderConverter";
import CustomFieldConverter from "../Converter/CustomFieldConverter";
import TagConverter from "../Converter/TagConverter";
import SettingConverter from "../Converter/SettingConverter";
import Password from "../Model/Password/Password";
import Folder from "../Model/Folder/Folder";
import Tag from "../Model/Tag/Tag";
import Server from "../Model/Server/Server";
import Session from "../Model/Session/Session";
import DataField from "../Model/CustomField/DataField";
import EmailField from "../Model/CustomField/EmailField";
import FileField from "../Model/CustomField/FileField";
import SecretField from "../Model/CustomField/SecretField";
import TextField from "../Model/CustomField/TextField";
import UrlField from "../Model/CustomField/UrlField";
import Setting from "../Model/Setting/Setting";
import ApiRequest from "../Network/ApiRequest";
import ApiResponse from "../Network/ApiResponse";
import SessionAuthorization from "../Authorization/SessionAuthorization";
import PWDv1Challenge from "../Authorization/Challenge/PWDv1Challenge";
import UserToken from "../Authorization/Token/UserToken";
import RequestToken from "../Authorization/Token/RequestToken";
import NoEncryption from "../Encryption/NoEncryption";
import CSEv1Encryption from "../Encryption/CSEv1Encryption";
import ExportV1Encryption from "../Encryption/ExportV1Encryption";
import CSEv1Keychain from "../Encryption/Keychain/CSEv1Keychain";
import Cache from "../Cache/Cache";
import BooleanState from "../State/BooleanState";
import ResponseContentTypeError from "../Exception/ResponseContentTypeError";
import ResponseDecodingError from "../Exception/ResponseDecodingError";
import UnknownPropertyError from "../Exception/UnknownPropertyError";
import TokenTypeNotSupported from "../Exception/TokenTypeNotSupported";
import NetworkError from "../Exception/NetworkError";
import HttpError from "../Exception/Http/HttpError";
import BadRequestError from "../Exception/Http/BadRequestError";
import UnauthorizedError from "../Exception/Http/UnauthorizedError";
import ForbiddenError from "../Exception/Http/ForbiddenError";
import NotFoundError from "../Exception/Http/NotFoundError";
import MethodNotAllowedError from "../Exception/Http/MethodNotAllowedError";
import TooManyRequestsError from "../Exception/Http/TooManyRequestsError";
import InternalServerError from "../Exception/Http/InternalServerError";
import BadGatewayError from "../Exception/Http/BadGatewayError";
import ServiceUnavailableError from "../Exception/Http/ServiceUnavailableError";
import GatewayTimeoutError from "../Exception/Http/GatewayTimeoutError";
import BasicClassLoader from "./BasicClassLoader";
import ModelService from "../Services/ModelService";
import PasswordService from "../Services/PasswordService";
import UnsupportedEncryptionTypeError from "../Exception/Encryption/UnsupportedEncryptionTypeError";
import InvalidObjectTypeError from "../Exception/Encryption/InvalidObjectTypeError";
import EncryptionNotEnabledError from "../Exception/Encryption/EncryptionNotEnabledError";
import ChallengeTypeNotSupported from "../Exception/ChallengeTypeNotSupported";
import ConfigurationError from "../Exception/ConfigruationError";
import MissingEncryptionKeyError from "../Exception/Encryption/MissingEncryptionKeyError";
import InvalidEncryptedTextLength from "../Exception/Encryption/InvalidEncryptedTextLength";
import HashService from "../Services/HashService";
import Logger from "../Logger/Logger";
import DefectField from "../Model/CustomField/DefectField";
import PreconditionFailedError from "../Exception/Http/PreconditionFailedError";
import EventEmitter from "../Event/EventEmitter";

export default class DefaultClassLoader extends BasicClassLoader {

    /**
     *
     * @return {Object}
     * @protected
     */
    _getDefaultClasses() {
        return {
            'repository.password': () => { return new PasswordRepository(this.getInstance('client')); },
            'repository.folder'  : () => { return new FolderRepository(this.getInstance('client')); },
            'repository.tag'     : () => { return new TagRepository(this.getInstance('client')); },
            'repository.setting' : () => { return new SettingRepository(this.getInstance('client')); },

            'collection.password': (...e) => { return new PasswordCollection(this.getInstance('converter.password'), ...e); },
            'collection.folder'  : (...e) => { return new FolderCollection(this.getInstance('converter.folder'), ...e); },
            'collection.field'   : (...e) => { return new CustomFieldCollection(this.getInstance('converter.field'), ...e); },
            'collection.tag'     : (...e) => { return new TagCollection(this.getInstance('converter.tag'), ...e); },
            'collection.setting' : (...e) => { return new SettingCollection(this.getInstance('converter.setting'), ...e); },

            'converter.password': () => { return new PasswordConverter(this.getInstance('client')); },
            'converter.folder'  : () => { return new FolderConverter(this.getInstance('client')); },
            'converter.field'   : () => { return new CustomFieldConverter(this.getInstance('client')); },
            'converter.tag'     : () => { return new TagConverter(this.getInstance('client')); },
            'converter.setting' : () => { return new SettingConverter(this.getInstance('client')); },

            'model.password'   : Password,
            'model.folder'     : Folder,
            'model.tag'        : Tag,
            'model.server'     : Server,
            'model.session'    : Session,
            'model.dataField'  : DataField,
            'model.emailField' : EmailField,
            'model.fileField'  : FileField,
            'model.secretField': SecretField,
            'model.textField'  : TextField,
            'model.urlField'   : UrlField,
            'model.defectField': DefectField,
            'model.setting'    : Setting,

            'network.request' : ApiRequest,
            'network.response': ApiResponse,

            'authorization.session': () => { return new SessionAuthorization(this.getInstance('client')); },

            'challenge.pwdv1': PWDv1Challenge,

            'token.user'   : UserToken,
            'token.request': RequestToken,

            'encryption.none' : () => { return new NoEncryption(this.getInstance('classes')); },
            'encryption.csev1': () => { return new CSEv1Encryption(this.getInstance('classes')); },
            'encryption.expv1': () => { return new ExportV1Encryption(this.getInstance('classes')); },

            'keychain.csev1': (k, p) => { return new CSEv1Keychain(this.getInstance('classes'), k, p); },

            'service.hash'    : () => { return new HashService(this.getInstance('classes')); },
            'service.model'   : () => { return new ModelService(this.getInstance('classes')); },
            'service.password': () => { return new PasswordService(this.getInstance('client')); },

            'logger': Logger,

            'cache.cache': Cache,

            'state.boolean': BooleanState,

            'event.event': EventEmitter,

            'exception.response.contenttype'  : ResponseContentTypeError,
            'exception.response.decoding'     : ResponseDecodingError,
            'exception.model.property'        : UnknownPropertyError,
            'exception.auth.challenge'        : ChallengeTypeNotSupported,
            'exception.auth.token'            : TokenTypeNotSupported,
            'exception.network'               : NetworkError,
            'exception.http'                  : HttpError,
            'exception.http.400'              : BadRequestError,
            'exception.http.401'              : UnauthorizedError,
            'exception.http.403'              : ForbiddenError,
            'exception.http.404'              : NotFoundError,
            'exception.http.405'              : MethodNotAllowedError,
            'exception.http.412'              : PreconditionFailedError,
            'exception.http.429'              : TooManyRequestsError,
            'exception.http.500'              : InternalServerError,
            'exception.http.502'              : BadGatewayError,
            'exception.http.503'              : ServiceUnavailableError,
            'exception.http.504'              : GatewayTimeoutError,
            'exception.encryption.unsupported': UnsupportedEncryptionTypeError,
            'exception.encryption.object'     : InvalidObjectTypeError,
            'exception.encryption.enabled'    : EncryptionNotEnabledError,
            'exception.encryption.key.missing': MissingEncryptionKeyError,
            'exception.encryption.text.length': InvalidEncryptedTextLength,
            'exception.configuration'         : ConfigurationError,


            // Old deprecated errors
            'exception.contenttype': ResponseContentTypeError,
            'exception.decoding'   : ResponseDecodingError,
            'exception.property'   : UnknownPropertyError,
            'exception.challenge'  : TokenTypeNotSupported,
            'exception.token'      : TokenTypeNotSupported,
            'exception.400'        : BadRequestError,
            'exception.401'        : UnauthorizedError,
            'exception.403'        : ForbiddenError,
            'exception.404'        : NotFoundError,
            'exception.405'        : MethodNotAllowedError,
            'exception.429'        : TooManyRequestsError,
            'exception.500'        : InternalServerError,
            'exception.502'        : BadGatewayError,
            'exception.503'        : ServiceUnavailableError,
            'exception.504'        : GatewayTimeoutError
        };
    };
}