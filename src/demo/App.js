import React, { useEffect, useState, useCallback } from 'react';
import { useWebId } from '@solid/react';
import styled from 'styled-components';
import { FormModel as FormModelClass } from 'solid-forms';
import SolidImg from '../assets/solid_logo.png';
import { ProviderLogin, Uploader, ProfileUploader, useNotification, FormModel } from '../lib';
import { AccessControlList } from '@classes';

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
  const [userInbox, setUserInbox] = useState('');
  const webId = useWebId();
  const { notification, createNotification } = useNotification(webId);

  const onChange = useCallback((event: Event) => {
    const { target } = event;
    setUserInbox(target.value);
  });

  const init = async () => {
    // const result = await discoverInbox(webId);
    // fetchNotification([{ path: result, inboxName: 'Global App' }]);

    const formModel = new FormModelClass(
      'https://jmartin.inrupt.net/public/shapes/book.shex',
      'https://jcampos.inrupt.net/public/formModel/book.ttl#formRoot'
    );
    const schema = await formModel.parseSchema(
      'https://jmartin.inrupt.net/public/shapes/book.shex'
    );
    const formModelOutput = await formModel.parseShEx(schema);
    // const formModelOutput = shexClass.convert();

    console.log(formModelOutput, 'model new');
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
          modelPath: 'https://jcampos.inrupt.net/public/formModel/book.ttl#formRoot',
          podPath: 'https://jcampos.inrupt.net/public/formModel/bookData.ttl',
          settings: {
            theme: {
              inputText: 'sdk-input',
              inputCheckbox: 'sdk-checkbox'
            }
          },
          onError: error => {
            // eslint-disable-next-line no-console
            console.log(error);
          },
          onSuccess: success => {
            // eslint-disable-next-line no-console
            console.log(success);
          }
        }}
        autoSave
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
      {/* webId && (
        <ShexFormComponent>
          <HandleShexForm {...{ webId }} />
        </ShexFormComponent>
      ) */}
      <NotificationSection>
        <h3>Create notification example using your inbox</h3>
        <input
          type="text"
          placeholder="Inbox Path"
          name="userInbox"
          onChange={onChange}
          value={userInbox}
        />
        <button
          type="button"
          disabled={!userInbox}
          onClick={() =>
            createNotification(
              {
                title: 'Notification Example',
                summary: 'This is a basic solid notification example.'
              },
              userInbox
            )
          }
        >
          Create notification
        </button>
      </NotificationSection>
    </DemoWrapper>
  );
};

export default App;
