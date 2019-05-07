import React from 'react';
import { cleanup, render } from 'react-testing-library';
import ShexFormBuilder  from './shex-form-builder.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const setup = (props) => {
    return (<ShexFormBuilder {...props} />);
};

describe('Shex ShapeForm Component', () => {
    const component = setup();
    const { container, rerender } = render(component);

    it('should renders without crashing', () => {
        expect(container).toBeTruthy();
    });

});
