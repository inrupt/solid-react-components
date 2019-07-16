const { context } = jest.requireActual('@solid/query-ldflex').default;

const ldflex = {
  context,
  resolve: jest.fn(),
  clearCache: jest.fn(),
  delete: jest.fn(() => true),
  add: jest.fn(() => true)
};
ldflex['ldp:inbox'] = ldflex;
ldflex['https://example.org/#me'] = ldflex['ldp:inbox'];

export default ldflex;
