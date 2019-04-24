import React from 'react';
import { useShex } from "@hooks";
import { ShexForm } from '../../../lib';

export const ShapeForm = ({ shexUri, documentUri }) => {
    const { shexData, addNewShexField, updateShexJ } = useShex(shexUri, documentUri);
    console.log(shexData);
    return (
        shexData.formData ? <ShexForm  {...{
            shexj: shexData.formData,
            documentUri: documentUri,
            addNewShexField,
            updateShexJ
        }} /> : null
    );
}


// BookDemo
