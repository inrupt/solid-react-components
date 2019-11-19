import SolidError from './error';
import * as shexUtil from './shex';
import solidResponse from './statusMessage';
import {
  fetchSchema,
  existDocument,
  createDocument,
  fetchLdflexDocument,
  getBasicPod
} from './solidFetch';
import ShexFormValidator from './shexFormValidator';

const getFileName = path => {
  // eslint-disable-next-line no-useless-escape
  return path.replace(/^.*[\\\/]/, '');
};

const getLocale = (): string => {
  if (navigator.languages !== undefined) return navigator.languages[0];
  return navigator.language ? navigator.language : 'en-US';
};

export {
  shexUtil,
  SolidError,
  solidResponse,
  fetchSchema,
  existDocument,
  createDocument,
  fetchLdflexDocument,
  ShexFormValidator,
  getFileName,
  getBasicPod,
  getLocale
};
