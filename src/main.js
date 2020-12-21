import PassLink from './PassLink/PassLink';
import PasswordsClient from './Client/PasswordsClient';
import BasicPasswordsClient from './Client/BasicPasswordsClient';
import EnhancedClassLoader from "./ClassLoader/EnhancedClassLoader";
import DefaultClassLoader from "./ClassLoader/DefaultClassLoader";
import BasicClassLoader from "./ClassLoader/BasicClassLoader";

/** @deprecated **/
const Api = PasswordsClient;

export default PasswordsClient;
export {PasswordsClient, BasicPasswordsClient, EnhancedClassLoader, DefaultClassLoader, BasicClassLoader, PassLink, Api};
