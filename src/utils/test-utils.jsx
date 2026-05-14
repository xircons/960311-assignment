import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { studentsApi } from '../features/students/studentsApi.js';
import coursesReducer from '../features/courses/coursesSlice.js';
import gradesReducer from '../features/grades/gradesSlice.js';

export function makeTestStore(preloadedState) {
  return configureStore({
    reducer: {
      [studentsApi.reducerPath]: studentsApi.reducer,
      courses: coursesReducer,
      grades: gradesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(studentsApi.middleware),
    preloadedState,
  });
}

export function renderWithProviders(ui, { store = makeTestStore(), ...options } = {}) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
