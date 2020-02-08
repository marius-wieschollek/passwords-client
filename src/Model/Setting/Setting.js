import InvalidScopeError from '../../Exception/InvalidScopeError';

export default class Setting {

    /**
     * @return {String}
     */
    get SCOPE_USER() {
        return 'user';
    }

    /**
     * @return {String}
     */
    get SCOPE_SERVER() {
        return 'server';
    }

    /**
     * @return {String}
     */
    get SCOPE_CLIENT() {
        return 'client';
    }

    /**
     * @return {String[]}
     */
    get SCOPES() {
        return [
            this.SCOPE_USER,
            this.SCOPE_SERVER,
            this.SCOPE_CLIENT
        ];
    }

    /**
     * @return {String}
     */
    get name() {
        return this._name;
    }

    /**
     * @param {String} value
     */
    set name(value) {
        this._name = value;
    }

    /**
     * @return {String}
     */
    get value() {
        return this._value;
    }

    /**
     * @param {String} value
     */
    set value(value) {
        this._value = value;
    }

    /**
     * @return {String}
     */
    get scope() {
        return this._scope;
    }

    /**
     * @param {String} value
     */
    set scope(value) {
        if(this.SCOPES.indexOf(value) === -1) {
            throw new InvalidScopeError(value);
        }

        this._scope = value;
    }

    /**
     * @param {String} name
     * @param {String} value
     * @param {String} scope
     */
    constructor(name, value, scope = 'client') {
        if(this.SCOPES.indexOf(scope) === -1) {
            throw new InvalidScopeError(scope);
        }

        this._name = name;
        this._value = value;
        this._scope = scope;
    }

    /**
     * @return {String}
     */
    getName() {
        return this._name;
    }

    /**
     * @param {String} value
     *
     * @return {Setting}
     */
    setName(value) {
        this.name = value;

        return this;
    }

    /**
     * @return {String}
     */
    getValue() {
        return this._value;
    }

    /**
     * @param {String} value
     *
     * @return {Setting}
     */
    setValue(value) {
        this.value = value;

        return this;
    }

    /**
     * @return {String}
     */
    getScope() {
        return this._scope;
    }

    /**
     * @param {String} value
     *
     * @return {Setting}
     */
    setScope(value) {
        this.scope = value;

        return this;
    }
}