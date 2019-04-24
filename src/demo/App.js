import React, { useState } from "react";
import { useWebId } from "@solid/react";
import styled from "styled-components";
import SolidImg from "../assets/solid_logo.png";
import { ProviderLogin, Uploader, ProfileUploader } from "../lib";
import { ShapeForm } from "./components/ShapeForm/shape-form.component";

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
  const [shexFormConfig, setShexFormConfig] = useState({});
  const webId = useWebId();
  const onChangeInput = (e: Event) => {
      setShexFormConfig({...shexFormConfig, [e.target.name]: e.target.value});
  }
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
          onComplete: uploadedFiles => {
            console.log(uploadedFiles);
          },
          render: props => <ProfileUploader {...{ ...props }} />
        }}
      />
        { webId && <ShexFormComponent>
            <h2>Shex Form</h2>
            <input placeholder={'Document Url'} name='documentUri' onChange={onChangeInput}/>
            <input placeholder={'ShexC Url'} name='shexUri' onChange={onChangeInput}/>
            <ShapeForm
                {...{
                documentUri: shexFormConfig.documentUri || webId,
                shexUri: shexFormConfig.shexUri || "/shapes/userProfile.shex"
                }}
            />
      </ShexFormComponent> }
    </DemoWrapper>
  );
};

//https://jairocampos.solid.community/public/book.ttl
// https://jairocampos.solid.community/public/book.shex
export default App;
