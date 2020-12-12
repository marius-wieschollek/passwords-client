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
import EventEmitter from "eventemitter3";
import ConfigurationError from "../Exception/ConfigruationError";
import ResponseContentTypeError from "../Exception/ResponseContentTypeError";
import ResponseDecodingError from "../Exception/ResponseDecodingError";
import UnknownPropertyError from "../Exception/UnknownPropertyError";
import TokenTypeNotSupported from "../Exception/TokenTypeNotSupported";
import EncryptionTypeNotSupported from "../Exception/EncryptionTypeNotSupported";
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
import BaseClassLoader from "./BaseClassLoader";
import ModelService from "../Services/ModelService";
import PasswordService from "../Services/PasswordService";

export default class DefaultClassLoader extends BaseClassLoader {

    /**
     *
     * @return {Object}
     * @protected
     */
    _getDefaultClasses() {
        return {
            repository   : {
                password: () => { return new PasswordRepository(this.getInstance('api')); },
                folder  : () => { return new FolderRepository(this.getInstance('api')); },
                tag     : () => { return new TagRepository(this.getInstance('api')); },
                setting : () => { return new SettingRepository(this.getInstance('api')); }
            },
            collection   : {
                password: (...e) => { return new PasswordCollection(this.getInstance('converter.password'), ...e); },
                folder  : (...e) => { return new FolderCollection(this.getInstance('converter.folder'), ...e); },
                field   : (...e) => { return new CustomFieldCollection(this.getInstance('converter.field'), ...e); },
                tag     : (...e) => { return new TagCollection(this.getInstance('converter.tag'), ...e); },
                setting : (...e) => { return new SettingCollection(this.getInstance('converter.setting'), ...e); }
            },
            converter    : {
                password: () => { return new PasswordConverter(this.getInstance('api')); },
                folder  : () => { return new FolderConverter(this.getInstance('api')); },
                field   : () => { return new CustomFieldConverter(this.getInstance('api')); },
                tag     : () => { return new TagConverter(this.getInstance('api')); },
                setting : () => { return new SettingConverter(this.getInstance('api')); }
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
                session: () => { return new SessionAuthorization(this.getInstance('api')); }
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
            service      : {
                model   : () => { return new ModelService(this); },
                password: () => { return new PasswordService(this.getInstance('api')); }
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