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
        classes.model.password = EnhancedPassword;
        classes.model.folder = EnhancedFolder;
        classes.model.tag = EnhancedTag;

        return classes;
    }
}