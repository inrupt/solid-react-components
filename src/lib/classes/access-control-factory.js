import solid from 'solid-auth-client';
import * as parse from 'parse-link-header';
import AccessControlList from './access-control-list';

/**
 * This factory will create and return a new ACL object while also fetching the Link
 * Header and returning the acl file location
 */
export default class ACLFactory {
  static createNewAcl = async (owner, documentUri) => {
    const aclUrl = await this.getAclUriFromHeader(documentUri);
    const aclUrlValidated = new URL(aclUrl, documentUri).href;
    return new AccessControlList(owner, documentUri, aclUrlValidated);
  };

  static getAclUriFromHeader = async documentUri => {
    try {
      const response = await solid.fetch(documentUri, { method: 'HEAD' });
      const parsedLinks = parse(response.headers.get('Link'));
      return parsedLinks.acl ? parsedLinks.acl.url : '';
    } catch (error) {
      throw error;
    }
  };
}
