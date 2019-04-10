import React from 'react';
import { useShex } from "@hooks";
import { ShexForm } from '../../../lib';

export const ShapeForm = ({ shexUri, documentUri }) => {
    const { shexData } = useShex(shexUri, documentUri, 'UserProfile');
   console.log(shexData.formData);
    return (
        shexData.formData ? <ShexForm  shexj={shexData.formData}/> : null
    );
}
