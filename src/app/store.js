import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from '../features/students/studentsSlice.js';
import coursesReducer from '../features/courses/coursesSlice.js';
import gradesReducer from '../features/grades/gradesSlice.js';

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    courses: coursesReducer,
    grades: gradesReducer,
  },
});
