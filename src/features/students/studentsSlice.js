import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addStudentAsync,
  deleteStudentAsync,
  fetchStudents,
  updateStudentAsync,
} from './studentsThunks.js';

function normalizeStudent(raw) {
  const gpa = Number(raw.gpa);
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? '',
    studentId: raw.studentId ?? '',
    major: raw.major ?? '',
    gpa: Number.isFinite(gpa) ? gpa : 0,
  };
}

const initialState = {
  list: [],
  status: 'idle',
  error: null,
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.list = action.payload.map(normalizeStudent);
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload != null
            ? String(action.payload)
            : String(action.error?.message ?? 'FAILED TO LOAD STUDENTS');
      })
      .addCase(addStudentAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.list.push(normalizeStudent(action.payload));
      })
      .addCase(updateStudentAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const updated = normalizeStudent(action.payload);
        const index = state.list.findIndex(
          (s) => String(s.id) === String(updated.id),
        );
        if (index !== -1) {
          state.list[index] = updated;
        }
      })
      .addCase(deleteStudentAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const id = action.payload;
        state.list = state.list.filter((s) => String(s.id) !== String(id));
      })
      .addMatcher(
        isAnyOf(
          addStudentAsync.pending,
          updateStudentAsync.pending,
          deleteStudentAsync.pending,
        ),
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          addStudentAsync.rejected,
          updateStudentAsync.rejected,
          deleteStudentAsync.rejected,
        ),
        (state, action) => {
          state.status = 'failed';
          state.error =
            action.payload != null
              ? String(action.payload)
              : String(action.error?.message ?? 'REQUEST FAILED');
        },
      );
  },
});

export default studentsSlice.reducer;
