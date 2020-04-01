import auth from 'solid-auth-client';
import data from '@solid/query-ldflex';

export const fetchSchema = async file => {
  try {
    const schemaDocument = await auth.fetch(file, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    if (schemaDocument.status !== 200) {
      throw schemaDocument;
    }

    const documentText = await schemaDocument.text();

    return documentText.toString();
  } catch (error) {
    return error;
  }
};

export const existDocument = async documentUri => {
  return auth.fetch(documentUri, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const createDocument = async (documentUri, body = '') => {
  const result = await existDocument();

  if (result.status === 404) {
    return auth.fetch(documentUri, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/sparql-update'
      },
      body
    });
  }

  return false;
};

export const fetchLdflexDocument = async documentUri => {
  try {
    if (documentUri && documentUri !== '') {
      const result = await existDocument(documentUri);

      if (result.status === 404) {
        const result = await this.createDocument(documentUri);

        if (result.status !== 200) {
          throw result;
        }
      }

      const document = await data[documentUri];

      return document;
    }
  } catch (error) {
    return error;
  }
};

export const getBasicPod = async webId => {
  try {
    if (webId) {
      try {
        const nameData = await data[webId]['vcard:fn'];
        const imageData = await data[webId]['vcard:hasPhoto'];
        const name = nameData ? nameData.value : webId;
        const image = imageData ? imageData.value : null;
        return { name, image, webId };
      } catch (ex) {
        // If we can't fetch the data for some reason, like a CORS issue or no valid data, just use the webId as the name
        console.log(ex);
        const name = webId;
        const image = null;
        return { name, image, webId };
      }
    }
    return {};
  } catch (e) {
    throw e;
  }
};

export const getIdpFromWebId = async webId => {
  try {
    let idp = null;
    if (webId) {
      const idpConfigUrl = `${new URL(webId).origin}/.well-known/openid-configuration`;
      // TODO: This could be parallelized
      const issuer = await data[webId]['solid:oidcIssuer'];
      console.log(`issuer: ${issuer}`);
      const idpConfig = await auth.fetch(idpConfigUrl);

      if (issuer) {
        // TODO: investigate why just assigning issuer to idp fails in the login process
        idp = `${issuer}`;
      } else if (idpConfig.ok) {
        idp = webId;
      }
    }
    console.log(`The IdP for ${webId} is ${idp}`);
    return idp;
  } catch (e) {
    console.error(e);
  }
};

export const ensureSlash = (inputPath, needsSlash) => {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  }
  return inputPath;
};
