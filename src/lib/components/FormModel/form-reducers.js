export const ModelActions = {
  UPDATE: 'update'
};

export const ModelReducer = (state, action) => {
  if (action.type === ModelActions.UPDATE) {
    const { payload } = action;
  } else {
    throw new Error('Action type not specified');
  }
};
