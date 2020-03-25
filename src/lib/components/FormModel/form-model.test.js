import React from 'react';
import { render, cleanup } from '@testing-library/react';
import FormModel from './form-model.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

/**
 * Form model wires all the functionality together. Logic for the individual
 * components should be in their respective tests
 */
test('FormModel Component', () => {});
