import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs, text, object} from "@storybook/addon-knobs";
import {
    ProviderLogin
} from "@solid-react-components";
import ProviderLoginReadme from "./README.md";

storiesOf('Provider Login', module).addDecorator(withKnobs).addParameters({
    readme: {
        // Show readme at the addons panel
        sidebar: ProviderLoginReadme,
    },
}).add('default', () => <ProviderLogin
    selectPlaceholder={text('selectPlaceholder','Select provider')}
    inputPlaholder={text('inputPlaceholder','Select provider')}
    formButtonText={text('formButtonText','Select provider')}
    btnTxtWebId={text('btnTxtWebId','Select provider')}
    btnTxtProvider={text('btnTxtProvider','Select provider')}
    className={text('className','Select provider')}
    callbackUri={text('callbackUri','Select provider')}
    errorsText={object('errorsText', {
        unknown: 'Unknown',
        webIdNotValid: 'WebId Not Valid',
        emptyProvider: 'Empty Provider',
        emptyWebId: 'Empty WebId'
    })}/>);
