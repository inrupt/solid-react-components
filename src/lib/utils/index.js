import SolidError from './error';
import * as shexUtil from './shex';
import solidResponse from './statusMessage';
import ShexFormValidator from './shexFormValidator';
import { parseInitialValue, getLocale, isValidDate, getFormattedLocale } from './datetimes';

import {
  fetchSchema,
  existDocument,
  createDocument,
  fetchLdflexDocument,
  getBasicPod
} from './solidFetch';

const getFileName = path => {
  // eslint-disable-next-line no-useless-escape
  return path.replace(/^.*[\\\/]/, '');
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
  getLocale,
  parseInitialValue,
  isValidDate,
  getFormattedLocale
};
