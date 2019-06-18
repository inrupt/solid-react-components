import { configure, addDecorator } from '@storybook/react';
import { addReadme } from 'storybook-readme';
import { withTests } from '@storybook/addon-jest';
import StoryRouter from 'storybook-react-router';

import results from '../jest-test-results.json';

import { jsxDecorator } from 'storybook-addon-jsx';

addDecorator(jsxDecorator);

addDecorator(
  withTests({
    results
  })
);
addDecorator(addReadme);

addDecorator(StoryRouter());

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
