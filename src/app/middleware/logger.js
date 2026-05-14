export const loggerMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV !== 'development') {
    return next(action);
  }

  console.group(action.type);
  console.log('prev state', store.getState());
  console.log('action', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
