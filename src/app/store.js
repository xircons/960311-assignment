import { configureStore } from '@reduxjs/toolkit';
import { studentsApi } from '../features/students/studentsApi.js';
import coursesReducer from '../features/courses/coursesSlice.js';
import gradesReducer from '../features/grades/gradesSlice.js';

export const store = configureStore({
  reducer: {
    [studentsApi.reducerPath]: studentsApi.reducer,
    courses: coursesReducer,
    grades: gradesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(studentsApi.middleware),
});
