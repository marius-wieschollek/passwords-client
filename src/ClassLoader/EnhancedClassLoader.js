import DefaultClassLoader from "./DefaultClassLoader";
import EnhancedPassword from "../Model/Password/EnhancedPassword";
import EnhancedFolder from "../Model/Folder/EnhancedFolder";
import EnhancedTag from "../Model/Tag/EnhancedTag";

export default class EnhancedClassLoader extends DefaultClassLoader {
    /**
     *
     * @return {Object}
     * @protected
     */
    _getDefaultClasses() {
        let classes = super._getDefaultClasses();
        classes.model.password = (d) => { return new EnhancedPassword(d, this.getInstance('api')); };
        classes.model.folder = (d) => { return new EnhancedFolder(d, this.getInstance('api')); };
        classes.model.tag = (d) => { return new EnhancedTag(d, this.getInstance('api')); };

        return classes;
    }
}