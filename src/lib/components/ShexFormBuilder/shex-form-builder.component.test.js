import React from 'react';
import { cleanup, render } from 'react-testing-library';
import ShexFormBuilder  from './shex-form-builder.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const setup = (props) => {
    return (<ShexFormBuilder {...props} />);
};


const defaultProps = {
    documentUri: '',
    shexUri:
        'https://jpablo.solid.community/public/shapes/profile.shex',
    successCallback: jest.fn(),
    errorCallback: jest.fn(),
}
describe('Shex ShapeForm Component', () => {
    const component = setup(defaultProps);
    const { container, getByText } = render(component);

    it('should render without crashing', () => {
        expect(container).toBeTruthy();
    });

    it('should render a submit button', () => {
        const text = getByText('Save');
        expect(text).toBeTruthy();
    });

    it('should render a reset button', () => {
        const text = getByText('Reset');
        expect(text).toBeTruthy();
    });

});
