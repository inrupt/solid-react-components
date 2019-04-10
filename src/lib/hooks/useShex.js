import { useCallback, useState, useEffect } from 'react';
import data from '@solid/query-ldflex';
import shexParser from '@shexjs/parser';
import shexCore from '@shexjs/core';

export const useShex = (fileShex: String, documentUri: String, shapeName: String) => {
    const [shexData, setShexData] = useState({});
    let shapes = [];

    const fetchShex = useCallback(async () => {
        const rootShex = await fetch(fileShex, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
        const rootShexText = await rootShex.text();

        return rootShexText.toString();
    });

    const fetchDocument = async () => {
        const document = await data[documentUri];

        return document;
    };

    const isLink = valueExpr => {
        return typeof valueExpr === 'string' || null;
    };

    const fillFormData = async (rootShape: Object, document: Object) => {
        const currentShape = shapes.find(shape => shape.id.includes(rootShape.id));
        let newExpressions = [];

        if (currentShape && currentShape.expression) {
            for await (let currentExpression of currentShape.expression.expressions) {
                let newExpression = {...currentExpression};

                if (!newExpression._formValues) newExpression._formValues = [];
                for await (let node of document[currentExpression.predicate]) {
                    const value = node.value;

                    if (isLink(currentExpression.valueExpr)) {
                        const childExpression = await fillFormData(
                            { id: newExpression.valueExpr, linkValue: value,
                                parentPredicate: newExpression.predicate }, data[value]);

                        const formFocus = rootShape.parentPredicate ? { value, parentPredicate: rootShape.parentPredicate } : { value };

                        newExpression._formValues = [
                            ...newExpression._formValues,
                            {
                                id: childExpression.id,
                                type: childExpression.type,
                                _formFocus: formFocus,
                                expression: childExpression.expression,
                            }];
                    } else {

                        if (rootShape.linkValue) {
                            newExpression = {
                                ...newExpression,
                                _formValues: [{...newExpression.valueExpr, _formFocus: { value }}],
                            }

                        } else {
                            const formFocus = documentUri ? { value,  parentSubject: documentUri } : { value };

                            newExpression = {
                                ...newExpression,
                                _formValues:[
                                    ...newExpression._formValues,
                                    {
                                        ...newExpression.valueExpr,
                                        _formFocus: formFocus
                                    }]
                            };
                        }
                    }
                }
                if (newExpression._formValues.length === 0) delete newExpression._formValues;

                newExpressions = [...newExpressions, newExpression];
            }
        }
        const newShape = {...currentShape, expression: { expressions: newExpressions}}
        return newShape;
    }



    const toShexJS = useCallback(async () => {
        const shexString = await fetchShex();
        const parser = shexParser.construct(window.location.href);
        const podDocument = await fetchDocument();
        const shexJ = shexCore.Util.AStoShExJ(parser.parse(shexString));

        shapes = shexJ.shapes;

        if (shapes.length > 0) {
            const formData = await fillFormData(
                { id: shapeName },
                podDocument
            );
            setShexData({ shexJ, formData });
        }
    });

    useEffect(() => {
        toShexJS();
    }, [fileShex, documentUri]);

    return {
        shexData
    };
};
