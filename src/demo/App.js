import React from "react";
import { useWebId } from "@solid/react";
import styled from "styled-components";
import SolidImg from "../assets/solid_logo.png";
import { ProviderLogin, Uploader, ProfileUploader } from "../lib";
import HandleShexForm from './components';

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

const Header = props => {
  return (
    <HeaderWrapper>
      <img src={SolidImg} alt="React logo" width="62" />
      <Headline>Solid React Components</Headline>
    </HeaderWrapper>
  );
};

const App = () => {
  const webId = useWebId();

  return (
    <DemoWrapper>
      <Header />
      <ProviderLogin callbackUri={`${window.location.origin}/`} />
      <Uploader
        {...{
          fileBase: "Your POD folder here",
          limitFiles: 1,
          limitSize: 500000,
          accept: "png,jpg,jpeg",
          onError: error => {
            console.log(error.statusText);
          },
          onComplete: (recentlyUploadedFiles, uploadedFiles) => {
            console.log(recentlyUploadedFiles, uploadedFiles);
          },
          render: props => <ProfileUploader {...{ ...props }} />
        }}
      />
        { webId && <ShexFormComponent>
            <HandleShexForm  {...{ webId }}/>
      </ShexFormComponent> }
    </DemoWrapper>
  );
};

export default App;
