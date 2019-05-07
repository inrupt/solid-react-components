import React, {useState} from 'react';
import styled from "styled-components";
import {ShexFormBuilder} from "@components";

const Form = styled.form``;

const Input = styled.input`
   margin: 20px 0;
   padding: 10px;
   width: 100%
   box-sizing: border-box;
`;

const Button = styled.button`
    margin: 20px 10px;
    border: 1px solid hsl(0, 0%, 80%);
    cursor: pointer;
    padding: 10px 30px;
`;

type Props = {
  webId: String
};


const HandleShexForm = ({ webId }:Props) => {

    const [shexFormConfig, setShexFormConfig] = useState({});
    const [podData, setPodData] = useState({ documentUri: webId, shexUri: '/shapes/userProfile.shex' });

    const onChangeInput = (e: Event) => {
        setShexFormConfig({...shexFormConfig, [e.target.name]: e.target.value});
    }

    const onSubmit = (e: Event) => {
        e.preventDefault();

        setPodData({ ...shexFormConfig });
    }

    const languageTheme = {
        language: 'en',
        addButtonText: '+ Add new '
    };

    return(
        <div>
            <h2>Shex Form</h2>
            <Form onSubmit={onSubmit}>
                <Input placeholder={'Document Url'} name='documentUri' onChange={onChangeInput}/>
                <Input placeholder={'ShexC Url'} name='shexUri' onChange={onChangeInput}/>
                <Button type='submit'>Load Form</Button>
            </Form>
            <ShexFormBuilder {...{ ...podData, languageTheme}} />
        </div>
    );
};

export default HandleShexForm;
