import { createSlice } from '@reduxjs/toolkit';

export const INITIAL_STUDENTS = [
  { id: 1, name: 'Somchai Rakpong', studentId: 'STU-1001', major: 'DII', gpa: 3.85 },
  { id: 2, name: 'Naree Thongdee', studentId: 'STU-1002', major: 'DII', gpa: 3.42 },
  { id: 3, name: 'Krit Suwan', studentId: 'STU-1003', major: 'DII', gpa: 3.91 },
  { id: 4, name: 'Malee Jaikaew', studentId: 'STU-1004', major: 'DII', gpa: 2.95 },
  { id: 5, name: 'Pong Srisuk', studentId: 'STU-1005', major: 'DII', gpa: 3.28 },
];

const initialState = {
  list: INITIAL_STUDENTS,
  status: 'idle',
  error: null,
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent(state, action) {
      state.list.push(action.payload);
    },
    deleteStudent(state, action) {
      state.list = state.list.filter((s) => s.id !== action.payload);
    },
    updateStudent(state, action) {
      const index = state.list.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        Object.assign(state.list[index], action.payload);
      }
    },
  },
});

export const { addStudent, deleteStudent, updateStudent } = studentsSlice.actions;
export default studentsSlice.reducer;
