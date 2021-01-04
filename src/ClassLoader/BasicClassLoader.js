import ObjectMerger from "../Utility/ObjectMerger";

export default class BasicClassLoader {

    constructor(classes = {}) {
        this._classes = Object.assign(this._getDefaultClasses(), classes);
        this._instances = {};
    }


    /**
     *
     * @param {String} name
     * @param {*} properties
     * @return {Object}
     * @api
     */
    getInstance(name, ...properties) {
        if(!this._instances.hasOwnProperty(name) || !this._instances[name]) {
            this._instances[name] = this.getClass(name, ...properties);
        }

        return this._instances[name];
    }

    /**
     *
     * @param {String} name
     * @param {Object} object
     * @return {BasicClassLoader}
     * @api
     */
    setInstance(name, object) {
        this._instances[name] = object;

        return this;
    }

    /**
     *
     * @param {String} name
     * @param {*} properties
     * @return {Object}
     */
    getClass(name, ...properties) {
        if(!this._classes.hasOwnProperty(name)) {
            throw new Error(`The class ${name} does not exist`);
        }

        let creator = this._classes[name];
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
     * @param {String} name
     * @param {Object} constructor
     * @return {BasicClassLoader}
     * @api
     */
    registerClass(name, constructor) {
        this._classes[name] = constructor;

        return this;
    }

    /**
     *
     * @return {Object}
     * @protected
     */
    _getDefaultClasses() {
        return {};
    }
}