import React from 'react';
import { useShex } from "@hooks";
import { ShexForm } from '../../../lib';

export const ShapeForm = ({ shexUri, documentUri }) => {
    const { shexData, addNewExpression } = useShex(shexUri, documentUri, 'UserProfile');
    
    return (
        shexData.formData ? <ShexForm  shexj={shexData.formData} addNewExpression={addNewExpression} documentUri={documentUri} /> : null
    );
}
