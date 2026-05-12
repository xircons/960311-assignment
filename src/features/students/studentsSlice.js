import {
  createEntityAdapter,
  createSlice,
  isAnyOf,
} from '@reduxjs/toolkit';
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
    id: String(raw.id),
    name: raw.name ?? '',
    studentId: raw.studentId ?? '',
    major: raw.major ?? '',
    gpa: Number.isFinite(gpa) ? gpa : 0,
  };
}

const studentsAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    String(a.name ?? '').localeCompare(String(b.name ?? ''), undefined, {
      sensitivity: 'base',
    }),
});

const initialState = studentsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

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
        studentsAdapter.setAll(
          state,
          action.payload.map(normalizeStudent),
        );
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
        studentsAdapter.addOne(state, normalizeStudent(action.payload));
      })
      .addCase(updateStudentAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        studentsAdapter.upsertOne(state, normalizeStudent(action.payload));
      })
      .addCase(deleteStudentAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const id = String(action.payload);
        studentsAdapter.removeOne(state, id);
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

export const {
  selectAll: selectAllStudents,
  selectById: selectStudentById,
  selectTotal: selectStudentCount,
  selectIds: selectStudentIds,
} = studentsAdapter.getSelectors((state) => state.students);

export default studentsSlice.reducer;
