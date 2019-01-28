import React from "react";
import styled from "styled-components";
import SolidImg from "../assets/solid_logo.png";
import { ProviderLogin, Uploader, ProfileUploader } from "../lib";

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

const Header = props => {
  return (
    <HeaderWrapper>
      <img src={SolidImg} alt="React logo" width="62" />
      <Headline>Solid React Components</Headline>
    </HeaderWrapper>
  );
};

const App = () => (
  <DemoWrapper>
    <Header />
    <ProviderLogin />
    <Uploader
      {...{
        className: "pure-u-12-12",
        fileBase: "https://jairo88.inrupt.net/public/uploader",
        limitFiles: 1,
        onStart: () => console.log('init'),
        onError: (error, file) => console.log(error, file, 'this catch errors'),
        onComplete: () => console.log('finished'),
        render: (props) => (
          <ProfileUploader {...{ ...props }} />
        )
      }}
    />
  </DemoWrapper>
);

export default App;
