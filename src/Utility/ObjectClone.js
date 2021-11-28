class ObjectClone {

    /**
     *
     * @param {Object} object
     * @return {Object}
     */
    clone(object) {
        if(typeof object !== 'object') return object;

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
                clone[key] = this.clone(element);
            } else {
                clone[key] = element;
            }
        }

        return clone;
    }
}

export default new ObjectClone();