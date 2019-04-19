import React from 'react';
import { useShex } from "@hooks";
import { ShexForm } from '../../../lib';

export const ShapeForm = ({ shexUri, documentUri }) => {
    const { shexData, addNewExpression, onUpdateShexJ } = useShex(shexUri, documentUri);
    console.log(shexData);
    return (
        shexData.formData ? <ShexForm  {...{
            shexj: shexData.formData,
            documentUri: documentUri,
            addNewExpression,
            onUpdateShexJ
        }} /> : null
    );
}


// BookDemo
