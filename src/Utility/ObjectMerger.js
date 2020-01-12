import ObjectClone from './ObjectClone';

class ObjectMerger {
    merge(target, source) {
        for(let key in source) {
            if(!source.hasOwnProperty(key)) continue;

            if(!target.hasOwnProperty(key) || target[key] === null) {
                target[key] = ObjectClone.clone(source[key]);
            }

            let targetValue = target[key],
                sourceValue = source[key];

            if(typeof targetValue === 'object' && typeof sourceValue === 'object') {
                target[key] = this.merge(targetValue, sourceValue);
            } else if(Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                target[key] = targetValue.concat(sourceValue);
            } else {
                target[key] = ObjectClone.clone(sourceValue);
            }
        }

        return target;
    }
}

export default new ObjectMerger();