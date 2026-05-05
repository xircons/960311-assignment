import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, code: 'DII101', title: 'Intro to DII', credits: 3, dept: 'DII' },
    { id: 2, code: 'DII201', title: 'Data Structures', credits: 3, dept: 'DII' },
    { id: 3, code: 'DII301', title: 'Web Development', credits: 3, dept: 'DII' },
    { id: 4, code: 'DII401', title: 'Capstone Project', credits: 6, dept: 'DII' },
  ],
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    addCourse(state, action) {
      state.list.push(action.payload);
    },
    deleteCourse(state, action) {
      state.list = state.list.filter((c) => c.id !== action.payload);
    },
  },
});

export const { addCourse, deleteCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
