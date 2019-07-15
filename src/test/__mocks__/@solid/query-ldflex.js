const { context } = jest.requireActual('@solid/query-ldflex').default;

export default {
  context,
  resolve: jest.fn(),
  clearCache: jest.fn(),
  delete: jest.fn(() => true),
  'ldp:inbox': ''
};
