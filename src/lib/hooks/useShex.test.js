import React from 'react';
import { useShex } from '@hooks';
import { cleanup, render } from 'react-testing-library';

const Shex = ({children, ...rest}) => children(useShex(rest));

function setup(props) {
    const returnShex = {};
    render(
        <Shex {...props}>
            {val => {
                Object.assign(returnShex, val)
                return null
            }}
        </Shex>,
    )
    return returnShex
}

describe('useWebId', () => {
    let result;

    afterAll( () => cleanup);

    it('returns object when shexC is not loaded', async () => {
        const result = await setup();

        expect(result.shexData).toEqual({});
        expect(result.addNewShexField).toBeTruthy();
        expect(result.updateShexJ).toBeTruthy();
    });


});
