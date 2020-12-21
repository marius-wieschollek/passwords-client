import ObjectMerger from "../Utility/ObjectMerger";

export default class BasicClassLoader {

    constructor(classes = {}) {
        this._classes = ObjectMerger.merge(this._getDefaultClasses(), classes);
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
     * @param {String} name
     * @param {Object} constructor
     * @return {BasicClassLoader}
     * @api
     */
    registerClass(name, constructor) {
        let path = name.split('.');

        if(!this._classes.hasOwnProperty(path[0])) {
            this._classes[path[0]] = {};
        }

        if(!this._classes[path[0]].hasOwnProperty(path[1])) {
            this._classes[path[1]] = {};
        }

        this._classes[path[0]][path[1]] = constructor;

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