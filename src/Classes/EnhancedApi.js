import SimpleApi from './SimpleApi';
import Encryption from './Encryption';
import EventEmitter from 'eventemitter3';

export default class EnhancedApi extends SimpleApi {

    /**
     * Is the user session authorized to make encrypted requests
     *
     * @returns {boolean}
     */
    get isAuthorized() {
        return this._isAuthorized === true;
    }

    /**
     * Is the encryption active and able to encrypt/decrypt
     *
     * @returns {boolean}
     */
    get hasEncryption() {
        return this.config.encryption.enabled;
    }

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this._isAuthorized = false;
    }

    /**
     * Initialize the api object
     *
     * @param config
     */
    initialize(config = {}) {
        if(!config.baseUrl || config.baseUrl.substr(0, 5) !== 'https') throw new Error('Invalid Base URL given');

        if(!config.folderIcon) config.folderIcon = `${config.baseUrl}core/img/filetypes/folder.svg`;
        if(!config.apiUrl) config.apiUrl = `${config.baseUrl}index.php/apps/passwords/`;

        if(!config.encryption) config.encryption = new Encryption();
        if(!config.cseMode || ['none', 'CSEv1r1'].indexOf(config.cseMode) === -1) config.cseMode = 'none';

        if(!config.device) {
            config.device = 'desktop';
            if(window && window.matchMedia('only screen and (max-width: 768px) and (hover: none)').matches) {
                config.device = 'mobile';
            }
        }

        if(!config.events) config.events = new EventEmitter();
        config.events.on('api.request.failed', (e) => {
            if(e.id && e.id === '4ad27488') this._resetAuthorisation();
        });
        config.events.on('api.session.token.changed', (d) => {
            if(d.oldSessionToken) this._resetAuthorisation();
        });

        super.initialize(config);
    }

    /**
     * Calculate the hash of the given string using the given algorithm
     *
     * @param value
     * @param algorithm
     * @returns {Promise<string>}
     */
    getHash(value, algorithm = 'SHA-1') {
        return this.config.encryption.getHash(value, algorithm);
    }

    /**
     * Open an api session with the given login data.
     * Decrypts the keychain automatically
     *
     * @param login
     * @returns {Promise}
     */
    async openSession(login) {
        let password = null;
        if(login.hasOwnProperty('password')) {
            login.challenge = this.config.encryption.solveChallenge(login.password, login.salts);
            password = login.password;
            delete login.salts;
            delete login.password;
        }

        let result = await this._sendRequest('session.open', login);
        if(password !== null && result.hasOwnProperty('keys') && result.keys.hasOwnProperty('CSEv1r1')) {
            this.config.encryption.setKeychain(result.keys.CSEv1r1, password);
        }

        this._isAuthorized = true;

        return result;
    }

    /**
     * Close the api session
     *
     * @returns {Promise}
     */
    async closeSession() {
        let result = await super.closeSession();
        this._resetAuthorisation();
        return result;
    }


    /**
     * Account Management
     */

    /**
     * Change or set the user account e2e password.
     * Handling of the keychain is also done by the function
     *
     * @param password
     * @param oldPassword
     * @returns {Promise<void>}
     */
    async setAccountChallenge(password, oldPassword = null) {
        let oldSecret = null;
        if(oldPassword !== null) {
            let oldChallenge = await super.getAccountChallenge();
            oldSecret = this.config.encryption.solveChallenge(oldPassword, oldChallenge.salts);
        }

        let challenge = this.config.encryption.createChallenge(password);

        let result = await super.setAccountChallenge(challenge.secret, challenge.salts, oldSecret);
        if(result.success) {
            let keychain = this.config.encryption.getKeychain(password, true);
            await super.setKeychain('CSEv1r1', keychain);
        }

        return result;
    }

    /**
     * Passwords
     */

    /**
     * Creates a new password with the given attributes
     *
     * @param data
     * @returns {Promise}
     */
    async createPassword(data = {}) {
        let object = this._cloneObject(data);

        try {
            object = this.flattenPassword(object);
            object = this.validatePassword(object);
        } catch(e) {
            return this._createRejectedPromise(e);
        }

        if(!object.hasOwnProperty('_encrypted')) object._encrypted = false;
        object.hash = await this.config.encryption.getHash(data.password);
        if(!object.label) this._generatePasswordTitle(object);

        if(this.config.encryption.enabled && object.cseType !== 'none') {
            this.config.encryption.encryptObject(object, 'password');
        } else {
            object.cseKey = '';
        }

        return await super.createPassword(object);
    }

    /**
     * Update an existing password with the given attributes.
     * If data does not contain an id, a new password will be created.
     *
     * @param data
     * @returns {Promise}
     */
    async updatePassword(data = {}) {
        if(!data.id) return this.createPassword(data);
        let object = this._cloneObject(data);

        try {
            object = this.flattenPassword(object);
            object = this.validatePassword(object);
        } catch(e) {
            return this._createRejectedPromise(e);
        }

        if(!object.hasOwnProperty('_encrypted')) object._encrypted = false;
        object.hash = await this.config.encryption.getHash(data.password);
        if(!object.label) this._generatePasswordTitle(object);

        if(this.config.encryption.enabled && object.cseType !== 'none' && (!data.hasOwnProperty('shared') || !data.shared)) {
            this.config.encryption.encryptObject(object, 'password');
        } else {
            object.cseType = 'none';
            object.cseKey = '';
        }

        return await super.updatePassword(object);
    }

    /**
     * Returns the password with the given id and the given detail level
     *
     * @param id
     * @param detailLevel
     * @returns {Promise}
     */
    async showPassword(id, detailLevel = 'model') {
        return this._processPassword(
            await super.showPassword(id, detailLevel)
        );
    }

    /**
     * Gets all the passwords, excluding those hidden or in trash
     *
     * @param detailLevel
     * @returns {Promise}
     */
    async listPasswords(detailLevel = 'model') {
        return this._processPasswordList(
            await super.listPasswords(detailLevel)
        );
    }

    /**
     * Gets all the passwords matching the criteria
     *
     * @param criteria
     * @param detailLevel
     * @returns {Promise}
     */
    async findPasswords(criteria = {}, detailLevel = 'model') {
        return this._processPasswordList(
            await super.findPasswords(criteria, detailLevel)
        );
    }


    /**
     * Folders
     */

    /**
     * Creates a new folder with the given attributes
     *
     * @param data
     * @returns {Promise}
     */
    createFolder(data = {}) {
        let object = this._cloneObject(data);

        try {
            object = this.flattenFolder(object);
            object = this.validateFolder(object);
        } catch(e) {
            return this._createRejectedPromise(e);
        }

        if(this.config.encryption.enabled && object.cseType !== 'none') {
            this.config.encryption.encryptObject(object, 'folder');
        } else {
            object.cseKey = '';
        }

        return super.createFolder(object);
    }

    /**
     * Update an existing folder with the given attributes.
     * If data does not contain an id, a new folder will be created.
     *
     * @param data
     * @returns {Promise}
     */
    updateFolder(data = {}) {
        if(!data.id) return this.createFolder(data);
        let object = this._cloneObject(data);

        try {
            object = this.flattenFolder(object);
            object = this.validateFolder(object);
        } catch(e) {
            return this._createRejectedPromise(e);
        }

        if(this.config.encryption.enabled && object.cseType !== 'none') {
            this.config.encryption.encryptObject(object, 'folder');
        } else {
            object.cseKey = '';
        }

        return super.updateFolder(object);
    }

    /**
     * Returns the folder with the given id and the given detail level
     *
     * @param id
     * @param detailLevel
     * @returns {Promise}
     */
    async showFolder(id, detailLevel = 'model') {
        return this._processFolder(
            await super.showFolder(id, detailLevel)
        );
    }

    /**
     * Gets all the folders, excluding those hidden or in trash
     *
     * @param detailLevel
     * @returns {Promise}
     */
    async listFolders(detailLevel = 'model') {
        return this._processFolderList(
            await super.listFolders(detailLevel)
        );
    }

    /**
     * Gets all the folders matching the criteria
     *
     * @param criteria
     * @param detailLevel
     * @returns {Promise}
     */
    async findFolders(criteria = {}, detailLevel = 'model') {
        return this._processFolderList(
            await super.findFolders(criteria, detailLevel)
        );
    }


    /**
     * Tags
     */

    /**
     * Creates a new tag with the given attributes
     *
     * @param data
     * @returns {Promise}
     */
    createTag(data = {}) {
        let object = this._cloneObject(data);

        try {
            object = this.flattenTag(object);
            object = this.validateTag(object);
        } catch(e) {
            return this._createRejectedPromise(e);
        }

        if(this.config.encryption.enabled && object.cseType !== 'none') {
            this.config.encryption.encryptObject(object, 'tag');
        } else {
            object.cseKey = '';
        }

        return super.createTag(object);
    }

    /**
     * Update an existing tag with the given attributes.
     * If data does not contain an id, a new tag will be created.
     *
     * @param data
     * @returns {Promise}
     */
    updateTag(data = {}) {
        if(!data.id) return this.createTag(data);
        let object = this._cloneObject(data);

        try {
            object = this.flattenTag(object);
            object = this.validateTag(object);
        } catch(e) {
            return this._createRejectedPromise(e);
        }

        if(this.config.encryption.enabled && object.cseType !== 'none') {
            this.config.encryption.encryptObject(object, 'tag');
        } else {
            object.cseKey = '';
        }

        return super.updateTag(object);
    }

    /**
     * Returns the tag with the given id and the given detail level
     *
     * @param id
     * @param detailLevel
     * @returns {Promise}
     */
    async showTag(id, detailLevel = 'model') {
        return this._processTag(
            await super.showTag(id, detailLevel)
        );
    }

    /**
     * Gets all the tags, excluding those hidden or in trash
     *
     * @param detailLevel
     * @returns {Promise}
     */
    async listTags(detailLevel = 'model') {
        return this._processTagList(
            await super.listTags(detailLevel)
        );
    }

    /**
     * Gets all the tags matching the criteria
     *
     * @param criteria
     * @param detailLevel
     * @returns {Promise}
     */
    async findTags(criteria = {}, detailLevel = 'model') {
        return this._processTagList(
            await super.findTags(criteria, detailLevel)
        );
    }


    /**
     * Shares
     */

    /**
     * Creates a new share with the given attributes
     *
     * @param data
     * @returns {Promise}
     */
    createShare(data = {}) {
        let object = this._cloneObject(data);

        try {
            object = this.flattenShare(object);
        } catch(e) {
            return this._createRejectedPromise(e);
        }

        return super.createShare(object);
    }

    /**
     * Update a share
     *
     * @param data
     * @returns {Promise}
     */
    updateShare(data = {}) {
        if(!data.id) return this.createShare(data);
        let object = this._cloneObject(data);

        try {
            object = this.flattenShare(object);
        } catch(e) {
            return this._createRejectedPromise(e);
        }

        return super.updateShare(object);
    }

    /**
     * Returns the share with the given id and the given detail level
     *
     * @param id
     * @param detailLevel
     * @returns {Promise}
     */
    async showShare(id, detailLevel = 'model') {
        return this._processShare(
            await super.showShare(id, detailLevel)
        );
    }

    /**
     * Gets all the shares, excluding those hidden or in trash
     *
     * @param detailLevel
     * @returns {Promise}
     */
    async listShares(detailLevel = 'model') {
        return this._processShareList(
            await super.listShares(detailLevel)
        );
    }

    /**
     * Gets all the shares matching the criteria
     *
     * @param criteria
     * @param detailLevel
     * @returns {Promise}
     */
    async findShares(criteria = {}, detailLevel = 'model') {
        return this._processShareList(
            await super.findShares(criteria, detailLevel)
        );
    }


    /**
     * Settings
     */

    /**
     *
     * @param setting
     * @returns {Promise<*>}
     */
    async getSetting(setting) {
        let data = await super.getSettings([setting]);
        return data[setting];
    }

    /**
     *
     * @param setting
     * @param value
     * @returns {Promise<*>}
     */
    async setSetting(setting, value) {
        let settings = {};
        settings[setting] = value;
        let data = await super.setSettings(settings);
        return data[setting];
    }

    /**
     *
     * @param setting
     * @returns {Promise<*>}
     */
    async resetSetting(setting) {
        let data = await super.resetSettings([setting]);
        return data[setting];
    }

    /**
     *
     * @param scopes
     * @returns {*}
     */
    listSettings(scopes = null) {
        if(typeof scopes === 'string') scopes = [scopes];
        return super.listSettings(scopes);
    }


    /**
     * Validation
     */

    /**
     *
     * @param password
     * @returns {*}
     */
    flattenPassword(password) {
        if(password.folder && typeof password.folder !== 'string') {
            password.folder = password.folder.id;
        }

        if(password.customFields && typeof password.customFields !== 'string') {
            password.customFields = JSON.stringify(password.customFields);
        }

        if(password.edited instanceof Date) {
            password.edited = Math.floor(password.edited.getTime() / 1000);
        }
        password = this._convertTags(password);

        return password;
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param folder
     * @returns {*}
     */
    flattenFolder(folder) {
        if(folder.parent && typeof folder.parent !== 'string') {
            folder.parent = folder.parent.id;
        }
        if(folder.edited instanceof Date) {
            folder.edited = Math.floor(folder.edited.getTime() / 1000);
        }

        return folder;
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param tag
     * @returns {*}
     */
    flattenTag(tag) {
        if(tag.edited instanceof Date) {
            tag.edited = Math.floor(tag.edited.getTime() / 1000);
        }

        return tag;
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param share
     * @returns {*}
     */
    flattenShare(share) {
        if(share.expires !== null && share.expires instanceof Date) {
            share.expires = Math.floor(share.expires.getTime() / 1000);
        }

        return share;
    }

    /**
     *
     * @param password
     * @param strict
     * @returns {Object}
     */
    validatePassword(password, strict = false) {
        let definitions = this.getPasswordDefinition();
        return this._validateObject(password, definitions, strict);
    }

    /**
     *
     * @param folder
     * @param strict
     * @returns {Object}
     */
    validateFolder(folder, strict = false) {
        let definitions = this.getFolderDefinition();
        return this._validateObject(folder, definitions, strict);
    }

    /**
     *
     * @param tag
     * @param strict
     * @returns {Object}
     */
    validateTag(tag, strict = false) {
        let definitions = this.getTagDefinition();
        return this._validateObject(tag, definitions, strict);
    }

    /**
     *
     * @param attributes
     * @param definitions
     * @param strict
     * @returns object
     */
    _validateObject(attributes, definitions, strict = false) {
        let object = {};

        for(let property in definitions) {
            if(!definitions.hasOwnProperty(property)) continue;
            let definition = definitions[property];

            if(!attributes.hasOwnProperty(property)) {
                if(definition.required) throw new Error(`Property ${property} is required but missing`);
                object[property] = definition.hasOwnProperty('default') ? definition.default:null;
                continue;
            }

            let attribute = attributes[property],
                type      = typeof attribute;

            if(definition.required && (!attribute || 0 === attribute.length)) {
                throw new Error(`Property ${property} is required but missing`);
            }
            attribute = this._validateObjectAttributeType(definition, type, attribute, strict, property);
            attribute = this._validateObjectAttributeLength(definition, attribute, strict, property, type);

            if(definition.hasOwnProperty('allowed') && definition.allowed.indexOf(attribute) === -1) {
                if(!strict || !definition.hasOwnProperty('default')) {
                    throw new Error(`Property ${property} has invalid value`);
                }
                attribute = definition.default;
            }

            object[property] = attribute;
        }


        return object;
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param definition
     * @param type
     * @param attribute
     * @param strict
     * @param property
     * @returns {*}
     * @private
     */
    _validateObjectAttributeType(definition, type, attribute, strict, property) {
        if(definition.type && definition.type !== type && (definition.type !== 'array' || !Array.isArray(attribute))) {
            if(!strict && definition.type === 'boolean') {
                attribute = Boolean(attribute);
            } else if(!strict && definition.hasOwnProperty('default')) {
                attribute = definition.default;
            } else if(strict || definition.required) {
                throw new Error(`Property ${property} has invalid type ${type}`);
            } else {
                attribute = null;
            }
        }
        return attribute;
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param definition
     * @param attribute
     * @param strict
     * @param property
     * @param type
     * @returns {*}
     * @private
     */
    _validateObjectAttributeLength(definition, attribute, strict, property, type) {
        if(definition.length) {
            if(Array.isArray(attribute) && attribute.length > definition.length) {
                if(strict) throw new Error(`Property ${property} exceeds the maximum length of ${definition.length}`);
                attribute = attribute.slice(0, definition.length);
            } else if(type === 'string' && attribute.length > definition.length) {
                if(strict) throw new Error(`Property ${property} exceeds the maximum length of ${definition.length}`);
                attribute = attribute.substr(0, definition.length);
            }
        }
        return attribute;
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param data
     * @private
     */
    _convertTags(data) {
        if(data.hasOwnProperty('tags')) {
            if(Array.isArray(data.tags)) {
                for(let i = 0; i < data.tags.length; i++) {
                    let tag = data.tags[i];
                    if(typeof tag !== 'string') data.tags[i] = tag.id;
                }
            } else {
                let tags = [];
                for(let id in data.tags) {
                    if(data.tags.hasOwnProperty(id)) tags.push(id);
                }
                data.tags = tags;
            }
        }

        return data;
    }

    /**
     *
     * @param object
     * @private
     */
    _cloneObject(object) {
        let clone = new object.constructor();

        for(let key in object) {
            if(!object.hasOwnProperty(key)) continue;
            let element = object[key];

            if(Array.isArray(element)) {
                clone[key] = element.slice(0);
            } else if(element instanceof Date) {
                clone[key] = new Date(element.getTime());
            } else if(element === null) {
                clone[key] = null;
            } else if(typeof element === 'object') {
                clone[key] = this._cloneObject(element);
            } else {
                clone[key] = element;
            }
        }

        return clone;
    }


    /**
     * Internal
     */

    /**
     *
     * @param e
     * @returns {Promise}
     * @private
     */
    _createRejectedPromise(e) {
        return new Promise((resolve, reject) => {
            let error = {status: 'error', message: e.message, error: e};
            reject(error);
        });
    }

    /**
     *
     * @param data
     * @returns {{}}
     * @private
     */
    _processPasswordList(data) {
        let passwords = {};

        for(let i = 0; i < data.length; i++) {
            let password = this._processPassword(data[i]);
            passwords[password.id] = password;
        }

        return passwords;
    }

    /**
     *
     * @param password
     * @returns {{}}
     * @private
     */
    _processPassword(password) {
        if(password.hasOwnProperty('cseType') && password.cseType !== 'none') {
            this.config.encryption.decryptObject(password, 'password');
        } else {
            password._encrypted = false;
        }

        password.type = 'password';
        if(password.url) {
            let host    = this.parseUrl(password.url, 'host'),
                imgHost = this._removeCommonSubdomains(host),
                website = this._getWebsiteNameFromDomain(host);
            password.host = host;
            password.website = website;
            password.icon = this.getFaviconUrl(imgHost);
            password.preview = this.getPreviewUrl(imgHost, this.config.device);
        } else {
            password.host = null;
            password.website = '';
            password.icon = this.getFaviconUrl(null);
            password.preview = this.getPreviewUrl(null);
        }

        if(password.customFields) {
            password.customFields = JSON.parse(password.customFields);
        } else {
            password.customFields = {};
        }


        if(password.tags) {
            password.tags = this._processTagList(password.tags);
        }
        if(password.revisions) {
            password.revisions = this._processPasswordList(password.revisions);
        }
        if(typeof password.folder === 'object') {
            password.folder = this._processFolder(password.folder);
        }
        if(password.share !== null && typeof password.share === 'object') {
            password.share = this._processShare(password.share);
        }
        if(Array.isArray(password.shares)) {
            password.shares = this._processShareList(password.shares);
        }

        password.created = new Date(password.created * 1e3);
        password.updated = new Date(password.updated * 1e3);
        password.edited = new Date(password.edited * 1e3);

        return password;
    }

    /**
     *
     * @param data
     * @returns {{}}
     * @private
     */
    _processFolderList(data) {
        let folders = {};

        for(let i = 0; i < data.length; i++) {
            let folder = this._processFolder(data[i]);
            folders[folder.id] = folder;
        }

        return folders;
    }

    /**
     *
     * @param folder
     * @returns {{}}
     * @private
     */
    _processFolder(folder) {
        if(folder.hasOwnProperty('cseType') && folder.cseType !== 'none') {
            this.config.encryption.decryptObject(folder, 'folder');
        } else {
            folder._encrypted = false;
        }

        folder.type = 'folder';
        folder.icon = this._config.folderIcon;
        if(folder.folders) {
            folder.folders = this._processFolderList(folder.folders);
        }
        if(folder.passwords) {
            folder.passwords = this._processPasswordList(folder.passwords);
        }
        if(folder.revisions) {
            folder.revisions = this._processFolderList(folder.revisions);
        }
        if(typeof folder.parent !== 'string') {
            folder.parent = this._processFolder(folder.parent);
        }

        folder.created = new Date(folder.created * 1e3);
        folder.updated = new Date(folder.updated * 1e3);
        folder.edited = new Date(folder.edited * 1e3);

        return folder;
    }

    /**
     *
     * @param data
     * @returns {{}}
     * @private
     */
    _processTagList(data) {
        let tags = {};

        for(let i = 0; i < data.length; i++) {
            let tag = this._processTag(data[i]);
            tags[tag.id] = tag;
        }

        return tags;
    }

    /**
     *
     * @param tag
     * @returns {{}}
     * @private
     */
    _processTag(tag) {
        if(tag.hasOwnProperty('cseType') && tag.cseType !== 'none') {
            this.config.encryption.decryptObject(tag, 'tag');
        } else {
            tag._encrypted = false;
        }

        tag.type = 'tag';
        if(tag.passwords) {
            tag.passwords = this._processPasswordList(tag.passwords);
        }
        if(tag.revisions) {
            tag.revisions = this._processTagList(tag.revisions);
        }
        tag.created = new Date(tag.created * 1e3);
        tag.updated = new Date(tag.updated * 1e3);
        tag.edited = new Date(tag.edited * 1e3);

        return tag;
    }

    /**
     *
     * @param data
     * @returns {{}}
     * @private
     */
    _processShareList(data) {
        let shares = {};

        for(let i = 0; i < data.length; i++) {
            let share = this._processShare(data[i]);
            shares[share.id] = share;
        }

        return shares;
    }

    /**
     *
     * @param share
     * @returns {*}
     * @private
     */
    _processShare(share) {
        share.type = 'share';

        if(typeof share.password !== 'string') {
            share.password = this._processPassword(share.password);
        }

        share.created = new Date(share.created * 1e3);
        share.updated = new Date(share.updated * 1e3);

        share.owner.icon = this.getAvatarUrl(share.owner.id);
        share.receiver.icon = this.getAvatarUrl(share.receiver.id);
        if(share.expires !== null) share.expires = new Date(share.expires * 1e3);

        return share;
    }

    /**
     * Generates an automatic title from the given data
     *
     * @param data
     * @returns string
     * @private
     */
    _generatePasswordTitle(data) {
        if(data.url) {
            data.label = this._getWebsiteNameFromDomain(this.parseUrl(data.url, 'host'));

            if(data.username) {
                let username = String(data.username);
                if(data.username.indexOf('@') !== -1) username = username.substr(0, username.indexOf('@'));

                data.label = `${data.label} – ${username}`;
            }
        } else if(data.username) {
            data.label = String(data.username);
        } else {
            let date     = new Date(),
                text     = 'Password',
                l10n     = {'de': 'Passwort', 'cs': 'Heslo', 'fr': 'Mot de passe', 'nl': 'Wachtwoord', 'ru': 'Пароль'},
                language = navigator.language.substr(0, 2);
            if(l10n.hasOwnProperty(language)) text = l10n[language];
            date.setTime(data.created ? data.created * 1000:Date.now());

            data.label = `${text} ${date.toLocaleDateString()}`;
        }
    }

    /**
     * Converts a domain like www.example.com to example.com
     *
     * @param domain
     * @private
     */
    _getWebsiteNameFromDomain(domain) {
        if((domain.match(/\./g) || []).length > 2) {
            let array = domain.split('.');
            domain = '';
            for(let i = 0; i < 3; i++) {
                let part = array.pop();
                if(part === 'co' && i === 1) i--;
                domain = (i === 2 ? '':'.') + part + domain;
            }
        }

        return this._removeCommonSubdomains(domain, ['www', 'www2', 'www3']);
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param domain
     * @param extraDomains
     * @returns {*}
     * @private
     */
    _removeCommonSubdomains(domain, extraDomains = []) {
        let subdomains = ['m', 'en', 'web', 'auth', 'mail', 'email', 'login', 'signin', 'profile', 'account', navigator.language].concat(extraDomains),
            regex      = RegExp(`^(.+\\.)?(${subdomains.join('|')})\\.(.+\\..+)`);

        return domain.replace(regex, '$3');
    }


    /**
     * Internal functions
     */

    /**
     *
     * @private
     */
    _resetAuthorisation() {
        this._isAuthorized = false;
        this.config.encryption.unsetKeychain();
    }


    /**
     * Object Definitions
     */

    /**
     *
     * @returns object
     */
    getPasswordDefinition() {
        let cseKeys    = [''],
            cseTypes   = ['none'],
            cseDefault = 'none';

        if(this.hasEncryption) {
            cseDefault = this.config.cseMode;
            cseTypes.push('CSEv1r1');
            cseKeys = this.config.encryption.keys;
            cseKeys.push('');
        }

        return {
            id          : {
                type  : 'string',
                length: 36
            },
            username    : {
                type  : 'string',
                length: 64
            },
            password    : {
                type    : 'string',
                length  : 256,
                required: true
            },
            label       : {
                type   : 'string',
                length : 64,
                default: null
            },
            url         : {
                type   : 'string',
                length : 2048,
                default: null
            },
            notes       : {
                type   : 'string',
                length : 4096,
                default: null
            },
            customFields: {
                type   : 'string',
                length : 10240,
                default: '[]'
            },
            folder      : {
                type   : 'string',
                length : 36,
                default: '00000000-0000-0000-0000-000000000000'
            },
            edited      : {
                type   : 'number',
                default: 0
            },
            hidden      : {
                type   : 'boolean',
                default: false
            },
            trashed     : {
                type   : 'boolean',
                default: false
            },
            favorite    : {
                type   : 'boolean',
                default: false
            },
            cseKey      : {
                type   : 'string',
                length : 36,
                default: '',
                allowed: cseKeys
            },
            cseType     : {
                type   : 'string',
                length : 10,
                default: cseDefault,
                allowed: cseTypes
            },
            tags        : {
                type   : 'array',
                default: []
            },
            _encrypted  : {
                type   : 'boolean',
                default: false
            }
        };
    }

    /**
     *
     * @returns object
     */
    getFolderDefinition() {
        let cseKeys    = [''],
            cseTypes   = ['none'],
            cseDefault = 'none';

        if(this.hasEncryption) {
            cseDefault = this.config.cseMode;
            cseTypes.push('CSEv1r1');
            cseKeys = this.config.encryption.keys;
            cseKeys.push('');
        }

        return {
            id        : {
                type  : 'string',
                length: 36
            },
            label     : {
                type    : 'string',
                length  : 48,
                required: true
            },
            parent    : {
                type   : 'string',
                length : 36,
                default: '00000000-0000-0000-0000-000000000000'
            },
            edited    : {
                type   : 'number',
                default: 0
            },
            hidden    : {
                type   : 'boolean',
                default: false
            },
            trashed   : {
                type   : 'boolean',
                default: false
            },
            favorite  : {
                type   : 'boolean',
                default: false
            },
            cseKey    : {
                type   : 'string',
                length : 36,
                default: '',
                allowed: cseKeys
            },
            cseType   : {
                type   : 'string',
                length : 10,
                default: cseDefault,
                allowed: cseTypes
            },
            _encrypted: {
                type   : 'boolean',
                default: false
            }
        };
    }

    /**
     *
     * @returns object
     */
    getTagDefinition() {
        let cseKeys    = [''],
            cseTypes   = ['none'],
            cseDefault = 'none';

        if(this.hasEncryption) {
            cseDefault = this.config.cseMode;
            cseTypes.push('CSEv1r1');
            cseKeys = this.config.encryption.keys;
            cseKeys.push('');
        }

        return {
            id        : {
                type  : 'string',
                length: 36
            },
            label     : {
                type    : 'string',
                length  : 48,
                required: true
            },
            color     : {
                type    : 'string',
                length  : 48,
                required: true
            },
            edited    : {
                type   : 'number',
                default: 0
            },
            hidden    : {
                type   : 'boolean',
                default: false
            },
            trashed   : {
                type   : 'boolean',
                default: false
            },
            favorite  : {
                type   : 'boolean',
                default: false
            },
            cseKey    : {
                type   : 'string',
                length : 36,
                default: '',
                allowed: cseKeys
            },
            cseType   : {
                type   : 'string',
                length : 10,
                default: cseDefault,
                allowed: cseTypes
            },
            _encrypted: {
                type   : 'boolean',
                default: false
            }
        };
    }
}