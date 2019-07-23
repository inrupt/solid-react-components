const { context } = jest.requireActual('@solid/query-ldflex').default;

const ldflex = {
  context,
  resolve: jest.fn(),
  clearCache: jest.fn(),
  delete: jest.fn(() => true),
  add: jest.fn(() => true),
  properties: [],
  subjects: []
};
ldflex['ldp:inbox'] = ldflex;
ldflex['https://example.org/#me'] = ldflex['ldp:inbox'];
ldflex['https://example.org/public/test.ttl.acl'] = { ...ldflex };

export default ldflex;
