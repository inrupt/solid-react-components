import React from 'react';
import { useWebId } from '@solid/react';
import styled from 'styled-components';
// import auth from 'solid-auth-client';
import SolidImg from '../assets/solid_logo.png';
import { ProviderLogin, Uploader, ProfileUploader } from '../lib';
import HandleShexForm from './components';
// import { Notification } from '../classes/notification';

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

const ShexFormComponent = styled.div`
    border-top: 1px solid black;
    
    input {
      margin: 20px 0;
      padding: 10px;
      width: 100%
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

const createFolder = async () => {
  // const notify = new Notification();
  // await notify.createInbox('https://jairocampos.solid.community/public/inboxtest/');
  // await auth.fetch('https://jairocampos.solid.community/public/gametest', { method: 'PUT'});
};

const App = () => {
  const webId = useWebId();
  createFolder();
  return (
    <DemoWrapper>
      <Header />
      <ProviderLogin callbackUri={`${window.location.origin}/`} />
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
      {webId && (
        <ShexFormComponent>
          <HandleShexForm {...{ webId }} />
        </ShexFormComponent>
      )}
    </DemoWrapper>
  );
};

export default App;
