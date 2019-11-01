import React, { useEffect, useState, useCallback } from 'react';
import { useWebId } from '@solid/react';
import styled from 'styled-components';
import { FormModel as FormModelClass } from 'solid-forms';
import SolidImg from '../assets/solid_logo.png';
import {
  ProviderLogin,
  Uploader,
  ProfileUploader,
  useNotification,
  FormModel,
  AutoSaveDefaultSpinner
} from '@lib';
import { AccessControlList } from '@classes';
import { NotificationTypes } from '@constants';

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
  const { notification, createNotification, discoverInbox } = useNotification(webId);

  const onWebIDChange = useCallback((event: Event) => {
    const { target } = event;
    setUserWebID(target.value);
  });

  const init = async () => {
    /* const formModel = new FormModelClass(
      'https://jcampos.inrupt.net/public/shex/book.shex',
      'https://jcampos.inrupt.net/public/formModel/book.ttl'
    );
    const schema = await formModel.parseSchema(
      'https://jcampos.inrupt.net/public/shex/book.shex'
    );
    const formModelOutput = await formModel.parseShEx(schema);

    // eslint-disable-next-line no-console
    console.log(formModelOutput, 'model new'); */
  };

  const createAcl = async () => {
    if (webId) {
      const uri = new URL(webId);
      const documentURI = `${uri.origin}/public/container`;
      const { MODES } = AccessControlList;
      const permissions = [{ modes: [MODES.CONTROL], agents: [webId] }];
      const aclInstance = new AccessControlList(webId, documentURI);
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
        NotificationTypes.ANNOUNCE
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
      <button type="button" onClick={createAcl}>
        Create ACL
      </button>
      <p>{JSON.stringify(notification && notification.notifications)}</p>
      <ProviderLogin callbackUri={`${window.location.origin}/`} />
      <FormModel
        {...{
          modelPath:
            'https://solidsdk.inrupt.net/private/FormLanguage/Form%20Model/UserProfileFormModel(NoLabels).ttl#formRoot',
          podPath: 'https://jmartin.inrupt.net/profile/card#me',
          settings: {
            theme: {
              inputText: 'sdk-input',
              inputCheckbox: 'sdk-checkbox'
            },
            savingComponent: AutoSaveDefaultSpinner
          },
          viewer: false,
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
        autoSave
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
