import React from 'react';
import { Language, ThemeShex } from '@context';
import { cleanup, render } from 'react-testing-library';
import { DeleteButton } from './delete-button.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const languageTheme = {
    language: 'en',
    addButtonText: '+ Add new '
};

const theme = {}

const defaultExpression = {
    annotations: []
};

const setup = (props, languageTheme) => {
    return (
        <ThemeShex.Provider value={theme}>
            <Language.Provider value={languageTheme}>
                <DeleteButton {...props} />
            </Language.Provider>
        </ThemeShex.Provider>
    );
};

describe('Shex ShapeForm Component', () => {
    const component = setup(
        { canDelete: true, defaultExpression },
        languageTheme
    );
    const { container, rerender } = render(component);

    it('should renders without crashing', () => {
        expect(container).toBeTruthy();
    });

    it('should renders language version', () => {
        const languageTheme = {
            language: 'es',
            deleteButton: 'Eliminar'
        };
        const component = setup(
            { canDelete: true, defaultExpression },
            languageTheme
        );

        rerender(component);
        expect(container).toHaveTextContent('Eliminar');
    });

    it('should not renders if canDelete is false', () => {
        const component = setup(
            { canDelete: false, defaultExpression },
            languageTheme
        );
        rerender(component);

        expect(container).toHaveTextContent('');
    });
});
