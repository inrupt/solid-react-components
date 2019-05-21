import React from 'react';
import { cleanup, render } from 'react-testing-library';
import ShexFormBuilder  from './shex-form-builder.component';
import { act } from 'react-dom/test-utils';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const setup = (props) => {
    return (<ShexFormBuilder {...props} />);
};



const defaultProps = {
    documentUri: '',
    shexUri:
        'https://jpablo.solid.community/public/shapes/profile.shex',
    successCallback: null,
    errorCallback: null,
}
describe('Shex ShapeForm Component', () => {
    let container;
    let getByText;

    act(() => {
        const component = setup(defaultProps);
        const options = render(component);
        container = options.container;
        getByText = options.getByText;
    })

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
