import React, { useEffect, useState, useCallback } from 'react';
import { useWebId } from '@solid/react';
import styled from 'styled-components';
// import { FormModel as FormModelClass } from '@inrupt/solid-sdk-forms';
import SolidImg from '../assets/solid_logo.png';
import {
  ProviderLogin,
  Uploader,
  ProfileUploader,
  useNotification,
  FormModel,
  Spinner,
  ProfileViewer
} from '@lib';
import { AccessControlList, ACLFactory } from '@classes';
import { AS } from '@pmcb55/lit-generated-vocab-common-rdfext';

const HeaderWrapper = styled.section`
  margin-top: 60px;
  text-align: center;
  width: 100%;
`;

const DemoWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Headline = styled.h1`
  color: #333;
  font-size: 36px;
  font-weight: 300;
`;

const NotificationSection = styled.div`
  button {
    &:disabled {
      cursor: not-allowed;
    }
  }

  input {
    margin: 20px 0;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <img src={SolidImg} alt="React logo" width="62" />
      <Headline>Solid React Components</Headline>
    </HeaderWrapper>
  );
};

const App = () => {
  const [userWebID, setUserWebID] = useState('');

  const webId = useWebId();
  const { notification, createNotification, discoverInbox, fetchNotification } = useNotification(
    webId
  );

  const onWebIDChange = useCallback((event: Event) => {
    const { target } = event;
    setUserWebID(target.value);
  });

  const init = async () => {
    /*
     * This code snippet will fetch notifications of a given inbox, running the full ShEx validation and everything
     * Comment out if you want to speed up App.js rendering
     */
    /*
    const inboxes = [{ path: 'https://jmartin.inrupt.net/public/games/tictactoe/inbox/', inboxName: 'Global Inbox', shape: 'default' }];
    await fetchNotification(inboxes);
    console.log(notification);
    */
    /*
     * This code snippet will run a form model conversion on a given shex shape.
     * Comment this out if you want to increase App.js performance. To enable, uncomment this
     * section and also the import statement for FormModelClass
     */
    /*
    const formModel = new FormModelClass(
      'https://solidsdk.inrupt.net/public/FormLanguage/examples/ShEx/decimal.shex',
      'https://jmartin.inrupt.net/profile/card#me'
    );
    const schema = await formModel.parseSchema(
      'https://solidsdk.inrupt.net/public/FormLanguage/examples/ShEx/decimal.shex'
    );
    const formModelOutput = await formModel.parseShEx(schema);

    // eslint-disable-next-line no-console
    console.log(formModelOutput, 'model new');
     */
  };

  const createAcl = async () => {
    if (webId) {
      const uri = new URL(webId);
      const documentURI = `${uri.origin}/public/container`;
      const { MODES } = AccessControlList;
      const permissions = [{ modes: [MODES.CONTROL], agents: [webId] }];
      const aclInstance = await ACLFactory.createNewAcl(webId, documentURI);
      await aclInstance.createACL(permissions);
    }
  };

  const sendSampleNotification = async () => {
    try {
      // Discover the inbox url from the resource, using ldp:inbox predicate
      const inboxUrl = await discoverInbox(userWebID);
      // The actor in this case is the current application, so we can use the current URL
      // Removing actor temporarily until we figure out how to link applications
      // const actor = window.location.href;

      if (!inboxUrl) {
        throw new Error('Inbox not found');
      }

      createNotification(
        {
          title: 'Notification Example',
          summary: 'This is a basic solid notification example.',
          actor: 'https://solidsdk.inrupt.net/profile/card#me'
        },
        inboxUrl,
        AS.Announce.value
      );
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(ex);
    }
  };

  useEffect(() => {
    if (webId) init();
  }, [notification.notify, webId]);

  return (
    <DemoWrapper>
      <Header />
      {webId && (
        <ProfileViewer
          {...{
            webId,
            direction: 'down',
            viewMoreText: 'See Profile',
            onError: error => {
              // eslint-disable-next-line no-console
              console.log('ERROR', error.statusText);
            },
            onClick: false
          }}
        >
          <span>Hover over me!</span>
        </ProfileViewer>
      )}

      <br />
      <button type="button" onClick={createAcl}>
        Create ACL
      </button>
      <p>{JSON.stringify(notification && notification.notifications)}</p>
      <ProviderLogin callbackUri={`${window.location.origin}/`} />
      <FormModel
        {...{
          modelSource: 'https://jmartin.inrupt.net/public/formmodel/float.ttl#formRoot',
          dataSource: 'https://jmartin.inrupt.net/profile/card#me',
          options: {
            theme: {
              inputText: 'sdk-input',
              inputCheckbox: 'sdk-checkbox checkbox',
              inputTextArea: 'sdk-textarea',
              multiple: 'sdk-multiple-button',
              form: 'inrupt-sdk-form',
              childGroup: 'inrupt-form-group'
            },
            autosaveIndicator: Spinner,
            autosave: true,
            viewer: false,
            language: 'en'
          },
          onError: error => {
            // eslint-disable-next-line no-console
            console.log(error, 'error');
          },
          onSuccess: success => {
            // eslint-disable-next-line no-console
            console.log(success);
          },
          onSave: response => {
            // eslint-disable-next-line no-console
            console.log(response);
          },
          onAddNewField: response => {
            // eslint-disable-next-line no-console
            console.log(response);
          },
          onDelete: response => {
            // eslint-disable-next-line no-console
            console.log(response);
          }
        }}
        liveUpdate
      />
      <Uploader
        {...{
          fileBase: 'Your POD folder here',
          limitFiles: 1,
          limitSize: 500000,
          accept: 'png,jpg,jpeg',
          onError: error => {
            // eslint-disable-next-line no-console
            console.log(error.statusText);
          },
          onComplete: (recentlyUploadedFiles, uploadedFiles) => {
            // eslint-disable-next-line no-console
            console.log(recentlyUploadedFiles, uploadedFiles);
          },
          render: props => <ProfileUploader {...{ ...props }} />
        }}
      />
      <NotificationSection>
        <h3>Create notification example using a WebID or Resource path</h3>
        <input
          type="text"
          placeholder="WebID or Resource"
          name="userWebID"
          onChange={onWebIDChange}
          value={userWebID}
        />
        <button type="button" disabled={!userWebID} onClick={sendSampleNotification}>
          Create notification
        </button>
      </NotificationSection>
    </DemoWrapper>
  );
};

export default App;
